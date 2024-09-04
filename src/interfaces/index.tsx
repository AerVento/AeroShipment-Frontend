import {
  FlightData,
  GoodsData,
  NewsBriefData,
  NewsDetailData,
  UserRole,
} from "~/data";

/**
 * V1.2接口文档
 */

/**
 * 基本响应
 */
interface BaseResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * ==========================================================================================
 * 用户模块接口
 * ==========================================================================================
 */

/**
 * 普通用户注册 响应
 */
export interface NormalUserRegisterResponse extends BaseResponse<null> {}

/**
 * 用户登录 响应
 */
export interface UserLoginResponse
  extends BaseResponse<{
    role: UserRole;
    token: string;
  }> {}

/**
 * 用户修改密码 响应
 */
export interface UserChangePasswordResponse extends BaseResponse<null> {}

/**
 * ==========================================================================================
 * 航班信息模块接口
 * ==========================================================================================
 */

/**
 * 分页获取航班信息 响应
 */
export interface GetFlightDataByPageResponse
  extends BaseResponse<FlightData[]> {}

/**
 * 获取N条最近航班信息 响应
 */
export interface GetLatestFlightDataResponse
  extends BaseResponse<FlightData[]> {}

/**
 * 根据Id获取航班信息 响应
 */
export interface GetFlightDataByIdResponse extends BaseResponse<FlightData> {}

/**
 * 增加航班信息 响应
 */
export interface AddFlightDataResponse extends BaseResponse<null> {}

/**
 * 减少航班信息 响应
 */
export interface RemoveFlightDataResponse extends BaseResponse<null> {}

/**
 * ==========================================================================================
 * 新闻信息模块接口
 * ==========================================================================================
 */

/**
 * 分页获取新闻简略信息 响应
 */
export interface GetNewsBriefDataByPageResponse
  extends BaseResponse<NewsBriefData[]> {}

/**
 * 获取N条最近新闻简略信息 响应
 */
export interface GetLatestNewsBriefDataResponse
  extends BaseResponse<NewsBriefData[]> {}

/**
 * 根据Id获取新闻信息 响应
 */
export interface GetNewsDetailDataByIdResponse
  extends BaseResponse<NewsDetailData> {}

/**
 * 增加新闻信息 响应
 */
export interface AddNewsDataResponse extends BaseResponse<null> {}

/**
 * 减少新闻信息 响应
 */
export interface RemoveNewsDataResponse extends BaseResponse<null> {}

/**
 * ==========================================================================================
 * 货物信息模块接口
 * ==========================================================================================
 */

/**
 * 查看一个用户的货物信息 响应
 */
export interface GetGoodsDataResponse extends BaseResponse<GoodsData> {}

/**
 * 分页获取货物信息 响应
 */
export interface GetGoodsDataByPage extends BaseResponse<GoodsData[]> {}

/**
 * 增加货物/修改货物 响应
 */
export interface AddOrModifyGoodsResponse extends BaseResponse<null> {}

/**
 * 增加货物（普通用户） 响应
 */
export interface NormalUserAddGoodsResponse extends BaseResponse<null> {}

/**
 * 移除货物 响应
 */
export interface RemoveGoodsResponse extends BaseResponse<null> {}
