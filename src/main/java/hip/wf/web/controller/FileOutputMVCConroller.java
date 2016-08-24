package hip.wf.web.controller;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import javax.activation.MimetypesFileTypeMap;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.core.io.Resource;
import org.springframework.util.ResourceUtils;

import ctd.util.AppContextHolder;
import ctd.util.ServletUtils;

public abstract class FileOutputMVCConroller extends MVCController {
	private static final MimetypesFileTypeMap mimeTypeMap = new MimetypesFileTypeMap();

	static {
		mimeTypeMap.addMimeTypes("image/png png");
	}

	protected void textFileOutput(HttpServletResponse response, Resource[] rs, boolean gzip) throws IOException {
		OutputStream output = null;
		if (gzip) {
			output = ServletUtils.buildGzipOutputStream(response);
		} else {
			output = response.getOutputStream();
		}
		long contentLen = 0l;
		try {
			for (Resource r : rs) {
				contentLen += r.contentLength();
				write(r, output);
				output.write(10);
				output.write(59);
			}
			if (!gzip) {
				response.setContentLength((int) contentLen);
			}
		} finally {
			output.close();
		}
	}

	protected void textFileOutput(HttpServletResponse response, Resource r, boolean gzip) throws IOException {
		OutputStream output = null;
		if (gzip) {
			output = ServletUtils.buildGzipOutputStream(response);
		} else {
			output = response.getOutputStream();
			response.setContentLength((int) r.contentLength());
		}
		try {
			write(r, output);
		} finally {
			output.close();
		}
	}

	protected void binaryFileOutput(HttpServletResponse response, Resource r) throws IOException {
		String name = r.getFilename();
		response.setContentType(mimeTypeMap.getContentType(name));
		response.setContentLength((int) r.contentLength());
		write(r, response.getOutputStream());
	}

	protected String getContentType(Resource r) {
		String name = r.getFilename();
		return mimeTypeMap.getContentType(name);
	}

	protected String getContentType(String name) {
		return mimeTypeMap.getContentType(name);
	}

	private void write(Resource r, OutputStream output) throws IOException {
		String protocol = r.getURL().getProtocol();
		// boolean isJarFile =
		// protocol.startsWith(ResourceUtils.URL_PROTOCOL_JAR);
		// boolean isUrlFile =
		// protocol.toLowerCase().startsWith(URL_PROTOCOL_HTTP);

		boolean isFileSystem = protocol.startsWith(ResourceUtils.URL_PROTOCOL_FILE);

		if (AppContextHolder.isDevMode() && isFileSystem) {
			File f = r.getFile();
			FileUtils.copyFile(f, output);
		} else {
			InputStream input = r.getInputStream();
			try {
				IOUtils.copy(input, output);
			} finally {
				input.close();
			}
		}
	}

}
