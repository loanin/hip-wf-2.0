package hip.wf.util;

import java.io.IOException;
import java.net.URL;

import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import ctd.resource.ResourceCenter;

public class HipResourceLoader {

	private static ResourceLoader loader = new DefaultResourceLoader();

	public static Resource loaderResource(String path) throws IOException {
		if(path.equals("demo/demo1.js")){
			System.out.println("1111");
		}
		Resource resource = ResourceCenter.loadOrNull(path);
	
		if (resource == null||!resource.getFile().exists()) {
			// resource = loader.getResource("/" + path);
			// resource = ResourceCenter.load("/", path);
			// System.out.println(path);
			URL fileURL = loader.getClass().getResource("/" + path);
			if (fileURL != null)
				resource = loader.getResource(fileURL.getFile());
		}
		return resource;
	}
}
