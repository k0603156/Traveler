import { all, fork, takeLatest, put, call } from "redux-saga/effects";
import {
  AUTH_CREATE_REQUEST,
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAILURE,
  AUTH_TOKENREFRESH_REQUEST,
  AUTH_TOKENREFRESH_SUCCESS,
  AUTH_TOKENREFRESH_FAILURE,
  AUTH_LOGOUT_REQUEST,
  AUTH_LOGOUT_SUCCESS,
  AUTH_LOGOUT_FAILURE,
  AUTH_DELETE_REQUEST,
  AUTH_DELETE_SUCCESS,
  AUTH_DELETE_FAILURE,
  IAuthLoginRequest,
  IAuthTokenrefreshRequest,
  IAuthLogoutRequest,
} from "./types";
import Api from "@Client/Api";
import { msgCreate } from "../Msg";
import { loadingStart, loadingFinish } from "../Loading";
import createRequestSaga from "@Store/lib/createRequestSaga";

//사용자 생성 요청
const authCreateSaga = createRequestSaga(
  AUTH_CREATE_REQUEST,
  Api.user.create_user
);
function* authCreate(): Generator {
  yield takeLatest(AUTH_CREATE_REQUEST, authCreateSaga);
}
export function* authLoginSaga(data: IAuthLoginRequest): Generator {
  yield put(loadingStart(data.type));
  const payload = {
    email: data.payload.email,
    password: data.payload.password,
  };
  try {
    const response: any = yield call(Api.auth.authenticate, payload);

    yield put({ type: AUTH_LOGIN_SUCCESS, payload: response.data });
    localStorage.setItem("token", response.data.response.token);
    localStorage.setItem("userName", response.data.response.userName);
    localStorage.setItem("email", response.data.response.email);
    yield put(
      msgCreate(AUTH_LOGIN_FAILURE, "ALERT", { message: "로그인되었습니다." })
    );
  } catch (error) {
    yield put(msgCreate(AUTH_LOGIN_FAILURE, "ERROR", error));
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("email");
  }
  yield put(loadingFinish(data.type));
}

export const authTokenrefreshSaga = createRequestSaga(
  AUTH_TOKENREFRESH_REQUEST,
  Api.auth.reauthorize
);

export function* authLogoutSaga(data: IAuthLogoutRequest): Generator {
  yield put(loadingStart(data.type));
  const payload = {
    email: data.payload.email,
  };
  try {
    const response: any = yield call(Api.auth.deauthorize, payload);
    if (response.status === 200) {
      yield put({ type: AUTH_LOGOUT_SUCCESS, payload: response.data });
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("email");
    }
  } catch (error) {
    yield put(msgCreate(AUTH_LOGOUT_FAILURE, "ERROR", error));
  }
  yield put(loadingFinish(data.type));
}
// 사용자 탈퇴 요청
const profileDeleteSaga = createRequestSaga(
  AUTH_DELETE_REQUEST,
  Api.user.delete_user
);

function* authLogin() {
  yield takeLatest(AUTH_LOGIN_REQUEST, authLoginSaga);
}
function* authTokenrefresh() {
  yield takeLatest(AUTH_TOKENREFRESH_REQUEST, authTokenrefreshSaga);
}
function* authLogout() {
  yield takeLatest(AUTH_LOGOUT_REQUEST, authLogoutSaga);
}
function* authDelete(): Generator {
  yield takeLatest(AUTH_DELETE_REQUEST, profileDeleteSaga);
}
export default function* authSaga(): Generator {
  yield all([
    fork(authCreate),
    fork(authLogin),
    fork(authTokenrefresh),
    fork(authLogout),
    fork(authDelete),
  ]);
}
