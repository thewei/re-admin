
import { observable } from 'mobx';
import cookie from 'utils/cookie';
import { QUERY_PANEL, SIDEBAR_PANEL } from 'constants/CookieKeys';

const maxAge = 60 * 60 * 24 * 30;

class PanelsStore {
	@observable isShowSidebar = cookie.get(SIDEBAR_PANEL) !== 'false';
	@observable isShowQuery = cookie.get(QUERY_PANEL) !== 'false';

	updateSidebar(val) {
		this.isShowSidebar = val;
		cookie.set(SIDEBAR_PANEL, val, { maxAge });
	}

	updateQuery(val) {
		this.isShowQuery = val;
		cookie.set(QUERY_PANEL, val, { maxAge });
	}
}

export default new PanelsStore();