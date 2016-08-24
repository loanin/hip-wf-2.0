package hip.wf.ftl;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.servlet.view.freemarker.FreeMarkerView;

/**
 * @description 扩展spring的FreemarkerView，加上root属性
 * 
 * @author yuedp
 * @date 2013-5-16
 */
public class ExtFreeMarkerView extends FreeMarkerView {

	public final static String CONTEXT_PATH_KEY = "root";

	/**
	 * 在model中增加部署路径root，方便处理部署路径问题。
	 */
	protected void exposeHelpers(Map<String, Object> model, HttpServletRequest request) throws Exception {
		super.exposeHelpers(model, request);
		model.put(CONTEXT_PATH_KEY, request.getContextPath());
	}

}