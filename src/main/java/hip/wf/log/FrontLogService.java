package hip.wf.log;

import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;

import ctd.annotation.RpcClass;
import ctd.annotation.RpcService;

/**
 * @author Loanin
 * @date 2016年8月30日
 * @describe 前端日志处理
 */
@RpcClass(serviceID = "frontLogService")
public class FrontLogService {

	private static HashMap<String, Logger> loggers = new HashMap<String, Logger>();

	@RpcService
	public void sendLog(Map<String, Object> event) throws Exception {
		Logger logger = null;
		String loggerName = event.get("logger").toString();
		if (loggers.containsKey(loggerName))
			logger = loggers.get(loggerName);
		else {
			logger = Logger.getLogger(loggerName);
			loggers.put(logger.getName(), logger);
		}
		String level = event.get("level").toString();
		Object message = event.get("message");
		if (logger.isInfoEnabled()&&level.toUpperCase().equals("INFO"))
			logger.info(message);
		if (logger.isDebugEnabled()&&level.toUpperCase().equals("DEBUG"))
			logger.debug(message);
		if (level.toUpperCase().equals("ERROR"))
			logger.error(message);
	}
}
