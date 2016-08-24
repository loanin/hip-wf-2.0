package hip.wf.web.controller;

import java.util.HashMap;
import java.util.Map;
import ctd.util.ServletUtils;

public abstract class MVCController {
	private long expiresSeconds = ServletUtils.ONE_DAY_SECONDS;
	private Map<String, Long> expiresDefinesMap = new HashMap<String, Long>();

	public void setExpiresSeconds(long expiresSeconds) {
		this.expiresSeconds = expiresSeconds;
	}

	public long getDefaultExpires() {
		return expiresSeconds;
	}

	protected long getFileExpires(String name) {

		if (expiresDefinesMap.containsKey(name)) {
			return expiresDefinesMap.get(name);
		}
		return expiresSeconds;
	}

	public void setExpiresDefinesMap(Map<String, Long> expiresDefinesMap) {
		this.expiresDefinesMap = expiresDefinesMap;
	}
}
