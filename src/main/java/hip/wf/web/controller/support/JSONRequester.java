package hip.wf.web.controller.support;

import hip.wf.util.UserRoleTokenUtils;
import hip.wf.web.controller.JSONOutputMVCConroller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import ctd.account.UserRoleToken;
import ctd.net.rpc.util.ServiceAdapter;
import ctd.util.JSONProtocol;
import ctd.util.JSONUtils;
import ctd.util.ServletUtils;
import ctd.util.context.Context;
import ctd.util.context.ContextUtils;
import ctd.util.exception.CodedBaseException;

@Controller("mvcJSONRequester")
public class JSONRequester extends JSONOutputMVCConroller {
	private static final Logger logger = LoggerFactory.getLogger("JSONRequester");
	private static final String SERVICE_ID_KEY = "serviceId";
	private static final String METHOD_KEY = "method";
	//private static final String ACTION_ID_KEY = "actionId";

	@SuppressWarnings("unchecked")
	@RequestMapping(value = "**/json/*.jsonRequest", method = RequestMethod.POST, headers = "content-type=application/json")
	public void doJSONRequest(HttpServletRequest request, HttpServletResponse response) {
		HashMap<String, Object> resData = new HashMap<String, Object>();
		String beanName = "";
		String method = "";
		long startTime = System.currentTimeMillis();
		try {

			// UserRoleToken token =
			// UserRoleTokenUtils.getUserRoleToken(request);
			// ContextUtils.put(Context.USER_ROLE_TOKEN, token);
			ContextUtils.put(Context.HTTP_REQUEST, request);
			HashMap<String, Object> reqData = JSONUtils.parse(request.getInputStream(), HashMap.class);
			//String actionId = (String) reqData.get(ACTION_ID_KEY);
			//if (isAccessableAction("", actionId)) {
			beanName = (String) reqData.get(SERVICE_ID_KEY);
			method = (String) reqData.get(METHOD_KEY);
			List<Object> parametersList = (List<Object>) reqData.get(JSONProtocol.BODY);
			Object result = ServiceAdapter.invokeWithUnconvertedParameters(beanName, method, parametersList, null, null);
			resData.put(JSONProtocol.CODE, 200);
			resData.put(JSONProtocol.BODY, result);
//			} else {
//				resData.put(JSONProtocol.CODE, 403);
//			}
		} catch (SecurityException e) {
			response.setStatus(HttpServletResponse.SC_FORBIDDEN);
		} catch (Exception e) {
			Throwable t = e.getCause();
			if (t instanceof CodedBaseException) {
				resData.put(JSONProtocol.CODE, ((CodedBaseException) t).getCode());
				logger.error(t.getMessage(), t);
			} else {
 				resData.put(JSONProtocol.CODE, 500);
 				logger.error(e.getMessage(), e);
			}
			resData.put(JSONProtocol.MSG, e.getMessage());
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		} finally {
			ContextUtils.clear();
		}

		try {
			boolean gzip = ServletUtils.isAcceptGzip(request);
			jsonOutput(response, resData, gzip);
		} catch (IOException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			logger.error(e.getMessage());
		}

		long endTime = System.currentTimeMillis();
		if (logger.isDebugEnabled())
			logger.debug("Service:" + beanName + "\rMethod:" + method + "\rCost:" + (endTime - startTime) + "\r" + request.toString());
	}

//	private boolean isAccessableAction(String principal, String actionId) {
//		return true;
//	}
}
