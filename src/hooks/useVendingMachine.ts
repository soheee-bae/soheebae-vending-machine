import { useCallback, useEffect, useMemo, useReducer } from "react";
import { CashList, initialState } from "../datas/initialData";
import {
  MachineState,
  type VendingMachine,
  type VendingMachineAction,
} from "../types/machine";
import type { Cash } from "../types/cash";

const vendingMachineReducer = (
  state: VendingMachine,
  action: VendingMachineAction
): VendingMachine => {
  switch (action.type) {
    case "INSERT_CASH": {
      const insertedAmount = action.payload.insertedAmount;
      const newBalance = state.currentBalance + insertedAmount;

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

      if (
        state.currentState === MachineState.CARD_PAYMENT ||
        state.isCardReady
      ) {
        newState = {
          ...state,
          isCardReady: false,
          currentBalance: newBalance,
          currentState: MachineState.CASH_PAYMENT,
          message: "카드 결제 취소, 현금 모드로 전환했습니다.",
        };
      } else {
        newState = {
          ...state,
          currentBalance: newBalance,
          currentState: MachineState.CASH_PAYMENT,
          message: `${insertedAmount}원 투입. 현재 잔액: ${newBalance}원`,
        };
      }

      return vendingMachineReducer(newState, { type: "CHECK_ACTIVE_ITEM" });
    }

    case "START_CARD_PAYMENT": {
      return {
        ...initialState,
        inventory: state.inventory,
        remainingCash: state.remainingCash,
        currentState: MachineState.CARD_PAYMENT,
        message: "카드 승인 대기 중...",
      };
    }

    case "CARD_PAYMENT_SUCCESS": {
      return {
        ...state,
        isCardReady: true,
        currentState: MachineState.READY_TO_SELECT,
        message: "카드 승인 완료. 음료를 선택하세요.",
      };
    }

    case "CARD_PAYMENT_FAILURE": {
      return {
        ...state,
        currentState: MachineState.ERROR,
        message: "카드 결제 실패. 다시 시도해 주세요.",
      };
    }

    case "CHECK_ACTIVE_ITEM": {
      const canBuyAnyDrink = state.inventory.some(
        (drink) => drink.price <= state.currentBalance && drink.stock > 0
      );

      if (canBuyAnyDrink) {
        return {
          ...state,
          isCashReady: true,
          currentState: MachineState.READY_TO_SELECT,
          message: `구매 가능한 음료를 선택하세요.`,
        };
      }
      return {
        ...state,
        isCashReady: false,
        currentState: MachineState.CASH_PAYMENT,
      };
    }

    case "SELECT_DRINK": {
      if (state.currentState !== MachineState.READY_TO_SELECT) return state;

      const selectedDrink = state.inventory.find(
        (item) => item.id === action.payload
      );

      // 확인차 다시 한번더 재고 체크
      if (!selectedDrink || selectedDrink.stock <= 0) {
        return vendingMachineReducer(state, {
          type: "SET_ERROR",
          payload: "재고가 없습니다.",
        });
      }

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

      // 확인차 다시 한번더 잔액 체크
      if (state.isCashReady && state.currentBalance < selectedDrink.price) {
        return vendingMachineReducer(state, {
          type: "SET_ERROR",
          payload: "잔액이 부족합니다.",
        });
      }

      const newInventory = state.inventory.map((item) =>
        item.id === selectedDrink.id ? { ...item, stock: item.stock - 1 } : item
      );

      if (state.isCashReady) {
        changeAmount = state.currentBalance - selectedDrink.price;
      }

      return {
        ...state,
        currentBalance: changeAmount > 0 ? changeAmount : 0,
        inventory: newInventory,
        message: "음료 배출 중...",
        currentState: MachineState.DISPENSING,
        isCardReady: false,
        isCashReady: false,
      };
    }

    case "RETURN_REQUEST": {
      if (state.currentBalance > 0) {
        return {
          ...state,
          currentState: MachineState.RETURNING_CHANGE,
          message: `현금 ${state.currentBalance}원 반환 처리 중...`,
        };
      }
      return state;
    }

    case "COMPLETE_DISPENSING": {
      if (state.currentBalance > 0) {
        return vendingMachineReducer(state, { type: "RETURN_REQUEST" });
      }
      return vendingMachineReducer(state, { type: "RESET_STATE" });
    }

    case "COMPLETE_CHANGE_RETURN": {
      const newRemainingCash = { ...state.remainingCash };
      const distribution: Record<number, number> = {};
      let remaining = state.currentBalance;

      for (const cash of CashList) {
        const available =
          state.remainingCash[cash as keyof typeof state.remainingCash] ?? 0;
        const useCount = Math.min(Math.floor(remaining / cash), available);
        if (useCount > 0) {
          distribution[cash] = useCount;
          remaining -= useCount * cash;
        }
      }

      for (const cash of CashList) {
        const used = distribution[cash] ?? 0;
        if (used > 0) {
          newRemainingCash[cash as keyof typeof newRemainingCash] =
            (newRemainingCash[cash as keyof typeof newRemainingCash] ?? 0) -
            used;
        }
      }

      return {
        ...state,
        inventory: state.inventory,
        remainingCash: newRemainingCash,
        currentState: MachineState.READY_TO_SELECT,
      };
    }

    case "CHANGE_INSUFFICIENT": {
      return {
        ...state,
        currentState: MachineState.ERROR,
        message: "잔돈이 부족합니다. 관리실에 문의 바랍니다.",
      };
    }

    case "SET_ERROR": {
      return {
        ...state,
        currentState: MachineState.ERROR,
        message: action.payload,
      };
    }

    case "RESET_STATE": {
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

  const isLoading = useMemo(() => {
    return (
      state.currentState === MachineState.CARD_PAYMENT ||
      state.currentState === MachineState.PROCESSING ||
      state.currentState === MachineState.DISPENSING ||
      state.currentState === MachineState.RETURNING_CHANGE
    );
  }, [state.currentState]);

  const changeCheck = (amount: number) => {
    if (amount <= 0) return 0;
    let remaining = amount;
    for (const cash of CashList) {
      const available =
        state.remainingCash[cash as keyof typeof state.remainingCash] ?? 0;
      const useCount = Math.min(Math.floor(remaining / cash), available);
      remaining -= useCount * cash;
      if (remaining <= 0) break;
    }

    return remaining;
  };

  const requestReturnChange = useCallback(() => {
    if (
      state.currentBalance > 0 &&
      state.currentState !== MachineState.RETURNING_CHANGE
    ) {
      dispatch({ type: "RETURN_REQUEST" });
    } else {
      dispatch({ type: "RESET_STATE" });
    }
  }, [state.currentBalance, state.currentState]);

  useEffect(() => {
    if (state.currentState !== MachineState.RETURNING_CHANGE) return;

    const timer = setTimeout(() => {
      const remainingCash = changeCheck(state.currentBalance);
      if (remainingCash <= 0) {
        dispatch({
          type: "COMPLETE_CHANGE_RETURN",
          payload: { remainingCash },
        });
        dispatch({ type: "RESET_STATE" });
      } else {
        dispatch({ type: "CHANGE_INSUFFICIENT" });
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [state.currentState, state.currentBalance, state.remainingCash]);

  const actions = useMemo(
    () => ({
      insertMoney: (amount: number) => {
        dispatch({ type: "INSERT_CASH", payload: { insertedAmount: amount } });
      },

      startCardPayment: async () => {
        dispatch({ type: "START_CARD_PAYMENT" });

        setTimeout(() => {
          const isSuccess = Math.random() > 0.3;
          if (isSuccess) {
            dispatch({ type: "CARD_PAYMENT_SUCCESS" });
          } else {
            dispatch({ type: "CARD_PAYMENT_FAILURE" });
          }
        }, 1500);
      },

      selectDrink: (drinkId: string) => {
        if (state.currentState !== MachineState.READY_TO_SELECT) return;

        const selectedDrink = state.inventory.find(
          (item) => item.id === drinkId
        );
        if (!selectedDrink) return;

        dispatch({ type: "SELECT_DRINK", payload: drinkId });

        setTimeout(() => {
          dispatch({ type: "PROCESS_PURCHASE", payload: { selectedDrink } });
          setTimeout(() => {
            dispatch({ type: "COMPLETE_DISPENSING" });
            requestReturnChange();
          }, 1500);
        }, 1500);
      },

      requestReturnChange,

      resetState: () => {
        dispatch({ type: "RESET_STATE" });
      },
    }),
    [requestReturnChange, state.currentState, state.inventory]
  );

  const isSelectable = (price: number, stock: number) => {
    if (stock <= 0 || isLoading) {
      return false;
    }

    if (state.currentState !== MachineState.READY_TO_SELECT) {
      return false;
    }

    const isAvailableByCash =
      state.isCashReady && state.currentBalance >= price;
    const isAvailableByCard = state.isCardReady;

    return isAvailableByCash || isAvailableByCard;
  };

  const isCashMode =
    state.currentState === MachineState.CASH_PAYMENT || state.isCashReady;
  const isCardMode =
    state.currentState === MachineState.CARD_PAYMENT || state.isCardReady;

  return { state, actions, isSelectable, isCashMode, isCardMode, isLoading };
};
