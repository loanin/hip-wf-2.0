package hip.wf.web.controller;

import java.io.IOException;
import java.io.OutputStream;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import ctd.util.ServletUtils;
import hip.wf.util.PackageUtil;

//用于输出网站页面索引
@Controller
public class WFController {

	private static Set<Class<?>> cs;// 某包下所有类

	@RequestMapping("index")
	public String index(HttpServletRequest request, HttpServletResponse response) throws IOException {
		// 获取所有的Controller注解的类
		List<String> pageList = new ArrayList<String>();
		String packageName = "hai";
		if (cs == null)
			cs = PackageUtil.getClasses(packageName);
		for (Class<?> ci : cs) {
			Controller co = ci.getAnnotation(Controller.class);
			if (co != null)
				for (Method mi : ci.getMethods()) {
					RequestMapping qm = mi.getAnnotation(RequestMapping.class);
					if (qm != null && qm.value().length > 0) {
						if (!"index".equals(qm.value()[0]))
							pageList.add(qm.value()[0]);
					}
				}
		}
		response.setContentType(ServletUtils.HTML_TYPE);
		StringBuffer sBuffer = new StringBuffer();
		sBuffer.append("<head>");
		sBuffer.append("<title>页面索引</title>");
		sBuffer.append("</head>");
		sBuffer.append("<body> <div style=\"margin: 20px;\">");
		for (String pg : pageList) {
			sBuffer.append("<li><a target=\"_blank\" href=\"" + pg + "\">" + pg + "</a></li>");
		}
		sBuffer.append("</div></body></html>");
		OutputStream out = response.getOutputStream();
		out.write(sBuffer.toString().getBytes());
		return null;
	}

	/**
	 * Loanin：独立模块调用控制器
	 * 
	 * @throws IOException
	 */
	@RequestMapping("/{modkey}.mod")
	public String module(HttpServletRequest request, HttpServletResponse response, @PathVariable("modkey") String modkey) throws IOException {
		StringBuffer sBuffer = new StringBuffer();
		sBuffer.append("<html>");
		sBuffer.append("<head>");
		sBuffer.append("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">");
		sBuffer.append("<title>" + modkey + "</title>");
		sBuffer.append("<script type=\"text/javascript\" src=\"script/bsoft.ssdev.jsui.boot.jsc\"></script>");
		sBuffer.append("<script type=\"text/javascript\" src=\"script/dependency.jquery.jquery-191-min.jsc\"></script>");
		sBuffer.append("</head>");
		sBuffer.append("<body></body>");
		sBuffer.append("<script type=\"text/javascript\">");
		sBuffer.append("$import('bsoft.hipdev.core.base', 'bsoft.hipdev.core.pageLoader');");
		sBuffer.append("$(document).ready(function() {");
		sBuffer.append("	$loadpage($(\"body\"), \"" + modkey + "\");");
		sBuffer.append("});");
		sBuffer.append("</script></html>");
		OutputStream out = response.getOutputStream();
		out.write(sBuffer.toString().getBytes());
		return null;
	}
}