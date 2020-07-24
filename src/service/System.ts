import { KeyName } from '../config/RedisKeys';
import { VerifyException } from '../utils/exceptions';
import { redisDb1 } from '../utils/redisTool';
/**
 * Created by wh on 2020/7/15
 * author: wanghao
 * @desc：系统操作Service
 */
export class SystemService {
	/**
	 * 查询全局配置Service
	 */
	public async findConfig() {
		// 从Redis拿取数据
		const system = await redisDb1.getString(KeyName.STR_CONFIG_SYSTETMF_INDKEY);
		if (system) {
			return system;
		}
		throw new VerifyException('系统设置不存在', 302);
	}

	/**
	 * 设置全局配置Service
	 */
	public async SetConfig(fieldList: any) {
		// 保存
		redisDb1.setString(KeyName.STR_CONFIG_SYSTETMF_INDKEY, JSON.stringify(fieldList));

		return fieldList;
	}
}
