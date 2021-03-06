import { Context } from "koa";

import { EnAccountTransfer, SenDredPack } from "../../format/Type";
import { Validate } from "../../utils/ReqValidate";
import { ReturnResult } from "../../utils/ReturnResult";
import { WeChatService } from "../../service/weichat/WeChat";
import { get, post } from "../../utils/decorator/httpMethod";

/**
 * Created by wh on 2020/7/23
 * author: wanghao
 * @desc：微信数据处理Controllers
 */
export default class WeChatController {
	/**
	 * 逻辑处理service类
	 */
    private readonly service: WeChatService;

    constructor() {
        this.service = new WeChatService();
    }

	/**
	 * 授权
	 * @param ctx koa中间件
	 */
    @get("/oauth")
    public async oauth(ctx: Context) {
        const state = await this.service.oauth(ctx);

        return (ctx.body = ReturnResult.successData(state));
    }

	/**
	 * 获取openid
	 * @param ctx koa中间件
	 */
    @get("/token")
    public async token(ctx: Context) {
        // Validate.isId(ctx.request.query.code);
        const state = await this.service.token(ctx.params.code);

        return (ctx.body = ReturnResult.successData(state));
    }
	/**
	 * (企业转账)支付
	 * @param ctx koa中间件
	 */
    @post("/transfers")
    public async transfers(ctx: Context) {
        // Validate.isId(ctx.request.body.openid);
        // Validate.isNumber(ctx.request.body.amount);
        const enAccountTransfer: EnAccountTransfer = ctx.params;
        const data = await this.service.transfers(enAccountTransfer);

        return (ctx.body = ReturnResult.successData(data));
    }
    /**
     * (企业红包)支付
     * @param ctx koa中间件
     */
    @post("/sendredpack")
    public async sendredpack(ctx: Context) {
        // Validate.isId(ctx.request.body.openid);
        // Validate.isNumber(ctx.request.body.amount);
        const senDredPack: SenDredPack = ctx.params;
        const data = await this.service.sendredpack(senDredPack);

        return (ctx.body = ReturnResult.successData(data));
    }
}
