import Remarkable from 'remarkable';
import PagingParam from './PagingParam.js';
const remarkable = new Remarkable();

export function getUrlParamsString(pagingParam, additionalParams) {
    let body = [];
    let urlParams = '';
    let needtoJoin = false;
    if (pagingParam) {

        if (pagingParam instanceof PagingParam) {

            if (pagingParam.getPage())
                body.push('page=' + encodeURIComponent(pagingParam.getPage()));

            if (pagingParam.getSize())
                body.push('size=' + encodeURIComponent(pagingParam.getSize()));

        } else {
            body.push('page=' + pagingParam);
        }

        needtoJoin = true;
    }

    if (additionalParams) {
        Array.prototype.push.apply(body, additionalParams);
        needtoJoin = true;
    }

    if (needtoJoin) {
        urlParams = body.join('&');
    }

    return urlParams;
}


export function scrollToTopPage(){
    var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
    if (currentScroll > 0) {
        window.requestAnimationFrame(scrollToTopPage);
        window.scrollTo (0, currentScroll - 20);
    }
}

export function escapeHTML(html) {
    return document.createElement('div')
        .appendChild(document.createTextNode(html))
        .parentNode
        .innerHTML;
}

export function createHtmlBody(msgs) {
    if (msgs) {
        if (Array.isArray(msgs)) {
            msgs.forEach(m => {
                m.bodyhtml = mkToHtml(m.body)
            });
        } else {
            msgs.bodyhtml = mkToHtml(msgs.body)
        }
    }
}

export function mkToHtml(text) {
    if (text) {
       return remarkable.render(text)
    }
    return null;
}