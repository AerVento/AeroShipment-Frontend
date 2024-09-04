/**
 * 用户角色
 */
export type UserRole = "admin" | "op" | "user";

/**
 * 航班信息
 */
export interface FlightData {
  /**
   * 航空公司
   */
  airline: string;
  /**
   * 降落时间
   */
  arrive_time: number;
  /**
   * 起飞时间
   */
  departure_time: number;
  /**
   * 航班目的地
   */
  dest: string;
  /**
   * 航班号码，ID 编号
   */
  id: string;
  /**
   * 最大载重
   */
  max_weight: number;
  /**
   * 剩余载重
   */
  remain_weight: number;
  /**
   * 航班出发地
   */
  source: string;
}

/**
 * 新闻简略信息
 */
export interface NewsBriefData {
  /**
   * 新闻id，ID 编号
   */
  id: number;
  /**
   * 发布时间
   */
  publish_time: number;
  /**
   * 标题
   */
  title: string;
}

/**
 * 新闻详细信息
 */
export interface NewsDetailData extends NewsBriefData {
  /**
   * 作者
   */
  author: string;
  /**
   * 正文内容
   */
  text: null | string;
}

/**
 * 货物信息
 */
export interface GoodsData {
  /**
   * 账户名，下此货物递送订单的用户
   */
  customer: string;
  /**
   * 目的地
   */
  dest: string;
  /**
   * 递送航班号码，负责递送此货物的航班号码
   */
  flight: null | string;
  /**
   * 货物id，ID 编号
   */
  id: number;
  /**
   * 货物名称
   */
  name: string;
  /**
   * 入库人，负责入库的仓管员账户名
   */
  operator: null | string;
  /**
   * 金额，寄送此货物的资费（元）*100
   */
  price: number | null;
  /**
   * 接收人
   */
  receiver: string;
  /**
   * 寄出时间
   */
  send_time: number;
  /**
   * 寄出人
   */
  sender: string;
  /**
   * 货物状态
   */
  status: GoodsStatus;
  /**
   * 货物总重
   */
  weight: number;
}

/**
 * 货物状态
 */
export type GoodsStatus =
  | "accepted"
  | "arrived"
  | "departed"
  | "finished"
  | "sending"
  | "waiting";
