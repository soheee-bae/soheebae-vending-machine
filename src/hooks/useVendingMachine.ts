import { useMemo, useReducer } from "react";
import { initialState } from "../datas/initialData";
import {
  MachineState,
  type VendingMachine,
  type VendingMachineAction,
} from "../types/machine";

const vendingMachineReducer = (
  state: VendingMachine,
  action: VendingMachineAction
): VendingMachine => {
  switch (action.type) {
    case "INSERT_CASH": {
      const insertedAmount = action.payload.insertedAmount;
      const newBalance = state.currentBalance + insertedAmount;

      // [예외 처리] 거래 처리 중 현금 투입 방지
      if (
        state.currentState === MachineState.PROCESSING ||
        state.currentState === MachineState.DISPENSING ||
        state.currentState === MachineState.RETURNING_CHANGE
      ) {
        return {
          ...state,
          message: "거래 처리 중에는 현금 투입이 어렵습니다.",
        };
      }

      let newState: VendingMachine;

      // [예외 처리] CARD_PAYMENT 상태에서 현금 투입 시 현금 모드 전환
      if (state.currentState === MachineState.CARD_PAYMENT) {
        newState = {
          ...state,
          isCardReady: false,
          currentBalance: newBalance,
          currentState: MachineState.CASH_PAYMENT,
          message: `${insertedAmount}원 투입. 카드 결제 취소, 현금 모드 전환. 현재 잔액: ${newBalance}원`,
        };
      } else {
        newState = {
          ...state,
          currentBalance: newBalance,
          currentState: MachineState.CASH_PAYMENT, // 현금 투입 -> CASH PAYMENT
          message: `${insertedAmount}원 투입. 현재 잔액: ${newBalance}원`,
        };
      }

      return vendingMachineReducer(newState, { type: "CHECK_ACTIVE_ITEM" });
    }

    case "START_CARD_PAYMENT": {
      // READY -> CARD PAYMENT
      return {
        // 인벤토리 상태를 보존
        ...initialState,
        inventory: state.inventory,
        remainingCash: state.remainingCash,
        currentState: MachineState.CARD_PAYMENT,
        message: "카드를 리더기에 넣어주세요. 승인 대기 중...",
      };
    }

    case "CARD_PAYMENT_SUCCESS": {
      // CARD PAYMENT -> READY TO SELECT
      return {
        ...state,
        isCardReady: true,
        currentState: MachineState.READY_TO_SELECT,
        message: "카드 승인 완료. 음료를 선택하세요.",
      };
    }

    case "CARD_PAYMENT_FAILURE": {
      // CARD PAYMENT -> ERROR
      return {
        ...state,
        currentState: MachineState.ERROR,
        message: "카드 결제 실패. 다시 시도해 주세요.",
      };
    }

    // [상태 전이 로직] CASH PAYMENT 상태에서 구매 가능한 아이템들 확인
    case "CHECK_ACTIVE_ITEM": {
      const canBuyAnyDrink = state.inventory.some(
        (drink) => drink.price <= state.currentBalance && drink.stock > 0
      );

      // 구매 가능한 음료가 있고, 현재 현금 결제 모드라면 READY_TO_SELECT로 전이
      if (canBuyAnyDrink) {
        return {
          ...state,
          isCashReady: true, // isCashReady: true
          currentState: MachineState.READY_TO_SELECT,
          message: `잔액 ${state.currentBalance}원. 구매 가능한 음료를 선택하세요.`,
        };
      }
      // 구매 가능한 음료가 없더라도 현금 모드는 유지
      return {
        ...state,
        isCashReady: false,
        currentState: MachineState.CASH_PAYMENT,
      };
    }

    case "SELECT_DRINK": {
      if (state.currentState !== MachineState.READY_TO_SELECT) return state;

      const selectedDrink = state.inventory.find(
        (d) => d.id === action.payload
      );

      if (!selectedDrink || selectedDrink.stock <= 0) {
        // 재고 없음
        return vendingMachineReducer(state, {
          type: "SET_ERROR",
          payload: "재고가 없습니다.",
        });
      }

      // [금액 확인] 현금 결제 모드일 때만 잔액 확인
      if (state.isCashReady && state.currentBalance < selectedDrink.price) {
        return vendingMachineReducer(state, {
          type: "SET_ERROR",
          payload: "잔액이 부족합니다.",
        });
      }

      // READY TO SELECT -> PROCESSING
      return {
        ...state,
        selectedDrinkId: action.payload,
        price: selectedDrink.price,
        currentState: MachineState.PROCESSING,
        message: `${selectedDrink.name} 구매 처리 중...`,
      };
    }

    case "PROCESS_PURCHASE": {
      const { selectedDrink } = action.payload;
      let changeAmount = 0;

      const newInventory = state.inventory.map((d) =>
        d.id === selectedDrink.id ? { ...d, stock: d.stock - 1 } : d
      );

      // 잔액 계산 및 잔돈 반환 결정
      if (state.isCashReady) {
        changeAmount = state.currentBalance - selectedDrink.price;
      }

      const nextState =
        state.isCashReady && changeAmount > 0
          ? MachineState.RETURNING_CHANGE // 잔돈 남으면 RETURNING_CHANGE
          : MachineState.DISPENSING; // 잔돈 없거나 카드 결제면 DISPENSING

      return {
        ...state,
        currentBalance: changeAmount > 0 ? changeAmount : 0, // 잔돈 금액을 currentBalance에 남김 (반환 대기)
        inventory: newInventory,
        message: "음료 배출 중...",
        currentState: nextState,
        isCardReady: false, // 카드 결제 플래그 해제
        isCashReady: false, // 현금 결제 플래그 해제 (결제 완료)
      };
    }

    case "RETURN_REQUEST": {
      // 사용자가 음료를 구매하지 않고 현금 반환 요청 시
      if (
        state.currentBalance > 0 &&
        (state.currentState === MachineState.CASH_PAYMENT || state.isCashReady)
      ) {
        return {
          ...state,
          currentState: MachineState.RETURNING_CHANGE,
          message: `현금 ${state.currentBalance}원 반환 처리 중...`,
        };
      }
      return state;
    }

    case "COMPLETE_DISPENSING": {
      // 배출 완료 후 잔돈이 남았는지 확인
      if (state.currentBalance > 0) {
        return vendingMachineReducer(state, { type: "RETURN_REQUEST" });
      }
      return vendingMachineReducer(state, { type: "RESET_STATE" });
    }

    case "COMPLETE_CHANGE_RETURN": {
      // 잔돈 반환 완료 -> READY
      return vendingMachineReducer(state, { type: "RESET_STATE" });
    }

    case "CHANGE_INSUFFICIENT": {
      // 자판기 잔돈 부족 -> ERROR
      return {
        ...state,
        currentState: MachineState.ERROR,
        message: action.payload,
      };
    }

    case "SET_ERROR": {
      return {
        ...state,
        currentState: MachineState.ERROR, // ERROR 상태
        message: action.payload,
      };
    }

    case "RESET_STATE": {
      // 초기 상태로 돌아가되, 인벤토리는 유지
      return {
        ...initialState,
        inventory: state.inventory,
        remainingCash: state.remainingCash,
        message: "거래가 완료되었습니다. 감사합니다.",
      };
    }

    default:
      return state;
  }
};

export const useVendingMachine = () => {
  const [state, dispatch] = useReducer(vendingMachineReducer, initialState);

  const actions = useMemo(
    () => ({
      insertMoney: (amount: number) => {
        // if (state.currentState !== MachineState.READY) return;
        dispatch({ type: "INSERT_CASH", payload: { insertedAmount: amount } });
      },

      startCardPayment: async () => {
        if (state.currentState !== MachineState.READY) return;
        dispatch({ type: "START_CARD_PAYMENT" });

        const isSuccess = true;
        if (isSuccess) {
          dispatch({ type: "CARD_PAYMENT_SUCCESS" });
        } else {
          dispatch({ type: "CARD_PAYMENT_FAILURE" });
        }
      },

      selectDrink: (drinkId: string) => {
        if (state.currentState !== MachineState.READY_TO_SELECT) return;

        const selectedDrink = state.inventory.find((d) => d.id === drinkId);
        if (!selectedDrink) return;

        // SELECT_DRINK 액션 디스패치 후 구매 처리 시작
        dispatch({ type: "SELECT_DRINK", payload: drinkId });
        dispatch({ type: "PROCESS_PURCHASE", payload: { selectedDrink } });

        // 비동기 배출 및 반환 프로세스 시작
        // processDispenseAndReturn(selectedDrink);
      },

      //   requestReturn: () => {
      //     if (state.currentBalance > 0) {
      //       dispatch({ type: "RETURN_REQUEST" });

      //       // 잔돈 반환 처리 로직 호출
      //       if (mockChangeCheck(state.currentBalance)) {
      //         setTimeout(
      //           () => dispatch({ type: "COMPLETE_CHANGE_RETURN" }),
      //           1500
      //         );
      //       } else {
      //         dispatch({
      //           type: "CHANGE_INSUFFICIENT",
      //           payload: "잔돈이 부족합니다.",
      //         });
      //       }
      //     }
      //   },

      resetError: () => {
        dispatch({ type: "RESET_STATE" });
      },
    }),
    [state.currentBalance, state.currentState, state.inventory]
  );

  const isSelectable = (price: number, stock: number) => {
    if (stock <= 0) return false;

    // READY_TO_SELECT 상태가 아니면 선택 불가
    if (state.currentState !== MachineState.READY_TO_SELECT) return false;

    if (state.isCashReady) {
      return state.currentBalance >= price;
    }
    if (state.isCardReady) {
      return true;
    }
    return false;
  };

  return { state, actions, isSelectable };
};
