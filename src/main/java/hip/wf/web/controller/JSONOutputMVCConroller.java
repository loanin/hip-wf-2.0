package hip.wf.web.controller;

import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.http.HttpServletResponse;

import ctd.util.JSONUtils;
import ctd.util.ServletUtils;

public abstract class JSONOutputMVCConroller extends MVCController {

	protected void jsonOutput(HttpServletResponse response, Object resData,
			boolean gzip) throws IOException {
		response.setContentType(ServletUtils.JSON_TYPE);
		response.setCharacterEncoding(ServletUtils.DEFAULT_ENCODING);
		OutputStream os = null;
		if (gzip) {
			os = ServletUtils.buildGzipOutputStream(response);
		} else {
			os = response.getOutputStream();
		}
		JSONUtils.write(os, resData);
	}
}
