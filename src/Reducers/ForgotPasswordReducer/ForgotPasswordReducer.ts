import { actionTypes } from "./ForgotPasswordActionTypes";
interface inputFieldType {
  value: string;
  isChecked: boolean;
}
interface changePasswordType {
  value: boolean;
}
interface number_of_failed_trialsType {
  value: number;
}
interface errorsType {
  isExist: boolean;
  value: string | "";
}
export interface initialStateType {
  userName: inputFieldType;
  email: inputFieldType;
  password: inputFieldType;
  changePassword: changePasswordType;
  errors: errorsType;
}
export interface ActionType {
  type: string;
  payload: ActionPayloadType;
}
interface ActionPayloadType {
  userName: string | "";
  email: string | "";
  password: string;
}
export const initialStateForgotPassword: initialStateType = {
  userName: {
    value: "",
    isChecked: false,
  } as inputFieldType,
  email: {
    value: "",
    isChecked: false,
  } as inputFieldType,
  password: {
    value: "",
    isChecked: false,
  } as inputFieldType,
  changePassword: {
    value: false,
  } as changePasswordType,
  errors: {
    isExist: false,
    value: "",
  } as errorsType,
};
export const ForgotPasswordReducer: (
  state: initialStateType,
  action: ActionType
) => initialStateType = (state = initialStateForgotPassword, action) => {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.CHANGE_PASSWORD_NOT_EMPTY: {
      return {
        ...state,
        email: {
          value: "",
          isChecked: false,
        },
        password: {
          value: "",
          isChecked: false,
        },
        changePassword: {
          value: false,
        },
        errors: {
          isExist: true,
          value: "We could not find an active account for these empty fields!",
        },
      };
    }
    case actionTypes.ERROR_CHECK_USERACCOUNT: {
      return {
        ...state,
        email: {
          value: "",
          isChecked: false,
        },
        password: {
          value: "",
          isChecked: false,
        },
        changePassword: {
          value: false,
        },
        errors: {
          isExist: true,
          value:
            "We could not find an active account for this username. if this issue persists, please contact support.",
        },
      };
    }
    case actionTypes.CHANGE_PASSWORD: {
      return {
        ...state,
        userName: {
          value: payload.userName,
          isChecked: false,
        },
        email: {
          value: payload.email,
          isChecked: false,
        },
        password: {
          value: payload.password,
          isChecked: true,
        },
        changePassword: {
          value: false,
        },
        errors: {
          isExist: false,
          value: "",
        },
      };
    }
    default:
      return state;
  }
};
export default ForgotPasswordReducer;
