//package hip.wf.web.controller.support;
//
//import java.io.FileNotFoundException;
//import java.io.IOException;
//
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletResponse;
//
//import org.apache.commons.logging.Log;
//import org.apache.commons.logging.LogFactory;
//import org.springframework.core.io.Resource;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestMethod;
//
//import ctd.resource.ResourceCenter;
//import ctd.util.ServletUtils;
//import hip.wf.web.controller.FileOutputMVCConroller;
//
//@Controller("mvcStaticLoader")
//public class StyleLoader extends FileOutputMVCConroller {
//
//	private static final Log logger = LogFactory.getLog(StyleLoader.class);
//
//	@RequestMapping(value = "style/{clz}.css", method = RequestMethod.GET)
//	public void loadStyle(@PathVariable String clz, HttpServletRequest request, HttpServletResponse response) {
//		try {
//			if (clz.indexOf(",") < 0) {
//				Resource r = loadStyleWithClassName(clz);
//				long lastModi = r.lastModified();
//				long expiresSeconds = getFileExpires(clz);
//				if (!ServletUtils.checkAndSetExpiresHeaders(request, response, lastModi, expiresSeconds)) {
//					return;
//				}
//				response.setContentType(ServletUtils.CSS_TYPE);
//				boolean gzip = ServletUtils.isAcceptGzip(request);
//				textFileOutput(response, r, gzip);
//			} else {
//				String[] classes = clz.split(",");
//				long lastModi = 0l;
//				long expiresSeconds = getDefaultExpires();
//				int n = classes.length;
//				Resource[] rs = new Resource[classes.length];
//				for (int i = 0; i < n; i++) {
//					clz = classes[i];
//					Resource r = loadStyleWithClassName(clz);
//					rs[i] = r;
//					lastModi = Math.max(lastModi, r.lastModified());
//					if (i == 0) {
//						expiresSeconds = getFileExpires(clz);
//					} else {
//						expiresSeconds = Math.min(expiresSeconds, getFileExpires(clz));
//					}
//				}
//				if (!ServletUtils.checkAndSetExpiresHeaders(request, response, lastModi, expiresSeconds)) {
//					return;
//				}
//				response.setContentType(ServletUtils.CSS_TYPE);
//				response.setCharacterEncoding(ServletUtils.DEFAULT_ENCODING);
//				boolean gzip = ServletUtils.isAcceptGzip(request);
//				textFileOutput(response, rs, gzip);
//			}
//
//		} catch (FileNotFoundException e) {
//			logger.error("StyleFile[" + clz + "] not found.");
//			ServletUtils.setNoCacheHeader(response);
//			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
//		} catch (IOException e) {
//			logger.error("StyleFile[" + clz + "] IOException", e);
//			ServletUtils.setNoCacheHeader(response);
//			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
//		}
//	}
//
//	private Resource loadStyleWithClassName(String clz) throws IOException {
//		StringBuffer path = new StringBuffer("/");
//		path.append(clz.replaceAll("\\.", "/")).append(".css");
//		Resource res = ResourceCenter.loadOrNull(path.toString());
//		if (res == null)
//			throw new FileNotFoundException();
//		return res;
//	}
//}
