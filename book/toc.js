// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="first.html">前提条件等</a></li><li class="chapter-item expanded affix "><li class="part-title">基本設定</li><li class="chapter-item expanded "><a href="first_set/teraterm_printf.html"><strong aria-hidden="true">1.</strong> TeraTermにprintf出力</a></li><li class="chapter-item expanded "><a href="first_set/teraterm_printf_lib.html"><strong aria-hidden="true">2.</strong> TeraTermにprintf出力(lib)</a></li><li class="chapter-item expanded "><a href="first_set/manydef.html"><strong aria-hidden="true">3.</strong> 名前を楽する(lib)</a></li><li class="chapter-item expanded affix "><li class="part-title">入出力</li><li class="chapter-item expanded "><a href="inout_put/digi_io.html"><strong aria-hidden="true">4.</strong> ディジタル入出力</a></li><li class="chapter-item expanded "><a href="inout_put/tim_Lchika.html"><strong aria-hidden="true">5.</strong> タイマー割り込みによるLチカ</a></li><li class="chapter-item expanded "><a href="inout_put/pwm_out.html"><strong aria-hidden="true">6.</strong> PWM出力</a></li><li class="chapter-item expanded "><a href="inout_put/ana_read.html"><strong aria-hidden="true">7.</strong> アナログ入力</a></li><li class="chapter-item expanded "><a href="inout_put/rorikon_read.html"><strong aria-hidden="true">8.</strong> ロータリーエンコーダを読む</a></li><li class="chapter-item expanded affix "><li class="part-title">通信</li><li class="chapter-item expanded "><a href="connectivity/uart_rev.html"><strong aria-hidden="true">9.</strong> UART通信(受信)</a></li><li class="chapter-item expanded "><a href="connectivity/arduino_lib.html"><strong aria-hidden="true">10.</strong> Arduinoとの通信(lib)</a></li><li class="chapter-item expanded affix "><li class="part-title">共有</li><li class="chapter-item expanded "><a href="some_share/gene_bin_file.html"><strong aria-hidden="true">11.</strong> binファイルの生成</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
