import "jest-enzyme";

import { AsyncValue } from "../../../src/store";
import { IEmployee, ShiftDay } from "../../../src/store/Employee";
import {
  EmployeesActionType,
  employeesReducer as reducer,
  IEmployeesState,
  INITIAL_STATE,
} from "../../../src/store/Employees";

describe("Employees reducer", () => {
  let testState: IEmployeesState;
  let testEmployee: IEmployee<string>;
  beforeEach(() => {
    testState = {
      employeesAction: { state: "PROGRESS" } as AsyncValue<any>,
    };
    testEmployee = {
      employeeName: "Taylor",
      phone: "555-5555",
      shift: ShiftDay.Friday,
      uid: "uid1",
    };
  });

  it("sets the initial state", () => {
    // Redux uses an action of {type: 'init'} to initialize state, but that is
    // internal to Redux implementation and we don't want to include that in
    // every reducer's action types. That then means the init action isn't
    // allowed by the type system, so we have to cast it as `any` to get around
    // that.
    expect(reducer(undefined, {} as any)).toEqual(INITIAL_STATE);
  });

  describe("watching the employees data", () => {
    describe("when started", () => {
      it("updates the asyncAction to in progress", () => {
        const expectedAction = { state: "PROGRESS" };
        testState.employeesAction.state = "INIT";

        expect(testState.employeesAction).not.toEqual(expectedAction);
        const state = reducer(testState, {
          type: EmployeesActionType.WATCH_START,
        });

        expect(state).toEqual({
          ...testState,
          employeesAction: expectedAction,
        });
      });
    });

    describe("when employees are fetched", () => {
      it("marks the asyncAction as complete", () => {
        const expectedAction = { state: "COMPLETE", value: expect.any(Object) };

        expect(testState.employeesAction).not.toEqual(expectedAction);
        const state = reducer(testState, {
          payload: {},
          type: EmployeesActionType.EMPLOYEES_FETCHED,
        });

        expect(state.employeesAction).toEqual(expectedAction);
      });

      it("overwrites previously fetched data", () => {
        const data1 = { foo: testEmployee };
        const data2 = { bar: testEmployee };

        const state = reducer(testState, {
          payload: data1,
          type: EmployeesActionType.EMPLOYEES_FETCHED,
        });
        const state2 = reducer(state, {
          payload: data2,
          type: EmployeesActionType.EMPLOYEES_FETCHED,
        });

        expect(state2.employeesAction.state).toEqual("COMPLETE");
        if (state2.employeesAction.state === "COMPLETE") {
          expect(state2.employeesAction.value).toBe(data2);
        }
      });

      it("sets the data as empty if the payload is null", () => {
        testState.employeesAction = {
          state: "COMPLETE",
          value: { foo: testEmployee },
        };
        const state = reducer(testState, {
          payload: null,
          type: EmployeesActionType.EMPLOYEES_FETCHED,
        });

        expect(state.employeesAction.state).toEqual("COMPLETE");
        if (state.employeesAction.state === "COMPLETE") {
          expect(state.employeesAction.value).toEqual({});
        }
      });
    });
  });

  describe("unsubscribing from the employees data", () => {
    it("resets the asyncAction to its initial state", () => {
      const expectedAction = { state: "INIT" };

      expect(testState.employeesAction).not.toEqual(expectedAction);
      const state = reducer(testState, {
        type: EmployeesActionType.UNSUBSCRIBE,
      });

      expect(state).toEqual({ ...testState, employeesAction: expectedAction });
    });
  });
});
