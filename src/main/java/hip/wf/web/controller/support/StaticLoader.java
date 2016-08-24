package hip.wf.web.controller.support;

import java.io.FileNotFoundException;
import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import ctd.resource.ResourceCenter;
import ctd.util.ServletUtils;
import hip.wf.web.controller.FileOutputMVCConroller;

@Controller("mvcStaticLoader")
public class StaticLoader extends FileOutputMVCConroller {

	private static final Log logger = LogFactory.getLog(StaticLoader.class);

	@RequestMapping(value = "**/resources/**/*.css", method = RequestMethod.GET)
	public void loadCSSFile(HttpServletRequest request, HttpServletResponse response) {
		String path = StringUtils.substringAfter(request.getRequestURI(), request.getContextPath() + "/resources");
		try {
			Resource r = ResourceCenter.load(path);
			if (!r.exists()) {
				logger.error("css[" + path + "] not found.");
				response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			} else {
				response.setContentType(ServletUtils.CSS_TYPE);
				long lastModi = r.lastModified();
				long expiresSeconds = getFileExpires(path);
				if (!ServletUtils.checkAndSetExpiresHeaders(request, response, lastModi, expiresSeconds)) {
					return;
				}
				boolean gzip = ServletUtils.isAcceptGzip(request);
				textFileOutput(response, r, gzip);
			}
		} catch (IOException e) {
			logger.error("css[" + path + "] load failed:", e);
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		}
	}

	@RequestMapping(value = "**/resources/**/*.css", method = RequestMethod.HEAD)
	public void cssFileHeadResponse(HttpServletRequest request, HttpServletResponse response) {
		String path = StringUtils.substringAfter(request.getRequestURI(), request.getContextPath() + "/resources");
		try {
			Resource r = ResourceCenter.load(path);
			if (!r.exists()) {
				ServletUtils.setNoCacheHeader(response);
				response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			} else {
				response.setContentType(ServletUtils.CSS_TYPE);
				response.setContentLength((int) r.contentLength());
				long lastModi = r.lastModified();
				long expiresSeconds = getFileExpires(path);
				ServletUtils.checkAndSetExpiresHeaders(request, response, lastModi, expiresSeconds);
			}
		} catch (FileNotFoundException e) {
			logger.error("CSSFile[" + path + "] head response not found.");
			ServletUtils.setNoCacheHeader(response);
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
		} catch (IOException e) {
			logger.error("CSSFile[" + path + "] head response failed:", e);
			ServletUtils.setNoCacheHeader(response);
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		}
	}

	@RequestMapping(value = "**/resources/**/*.*", method = RequestMethod.GET)
	public void loadStaticFile(HttpServletRequest request, HttpServletResponse response) {
		String path = StringUtils.substringAfter(request.getRequestURI(), request.getContextPath() + "/resources");
		try {
			Resource r = ResourceCenter.load(path);
			long lastModi = r.lastModified();
			long expiresSeconds = getFileExpires(path);
			if (!ServletUtils.checkAndSetExpiresHeaders(request, response, lastModi, expiresSeconds)) {
				return;
			}
			binaryFileOutput(response, r);
		} catch (FileNotFoundException e) {
			ServletUtils.setNoCacheHeader(response);
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			logger.error("resourceFile[" + path + "] not found.");
		} catch (IOException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			logger.error("resourceFile[" + path + "] IOException", e);
		}
	}

	@RequestMapping(value = "**/resources/**/*.*", method = RequestMethod.HEAD)
	public void staticFileHeadResponse(HttpServletRequest request, HttpServletResponse response) {
		String path = StringUtils.substringAfter(request.getRequestURI(), request.getContextPath() + "/resources");
		try {
			Resource r = ResourceCenter.load(path);
			if (!r.exists()) {
				ServletUtils.setNoCacheHeader(response);
				response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			} else {
				long lastModi = r.lastModified();
				response.setContentType(getContentType(r));
				response.setContentLength((int) r.contentLength());
				long expiresSeconds = getFileExpires(path);
				ServletUtils.checkAndSetExpiresHeaders(request, response, lastModi, expiresSeconds);
			}
		} catch (FileNotFoundException e) {
			logger.error("StaticFile[" + path + "] head response not found.");
			ServletUtils.setNoCacheHeader(response);
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
		} catch (IOException e) {
			logger.error("StaticFile[" + path + "] head response failed:", e);
			ServletUtils.setNoCacheHeader(response);
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		}
	}
}
