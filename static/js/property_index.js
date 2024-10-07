function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}



function show_loading(show = true) {
    const loader = document.querySelector(".loading_section"),
        body = document.querySelector("body");
    if (!show) {
        loader.style.display = "none";
        body.style.overflow = "auto";
    } else {
        loader.style.display = "flex";
        body.style.overflow = "hidden";
    }
}


function popup_func() {

    function show_popup(innerHtml, raw_innerHtml = false) {
        // @param: innerHtml is a classname of the direct child of .popup_data_holder which is copied to popup
        const popup = document.querySelector(".popup_section"),
            popup_holder = document.querySelector(".popup_section .popup_holder");
        if (innerHtml) {
            if (!raw_innerHtml) {
                innerHtml = document.querySelector(".popup_data_holder ." + innerHtml).innerHTML;
            }
            popup.style.display = "flex";
            popup_holder.innerHTML = innerHtml;
            let popup_links = document.querySelectorAll(".popup_section a");
            popup_links.forEach((link) => { link.addEventListener("click", link_open_scrollto) });
        } else {
            popup.style.display = "none";
            popup_holder.innerHTML = "";
        }
    }

    // to close the popup
    document.querySelector(".popup_section").addEventListener('click', () => {
        document.querySelector(".popup_section").style.display = "none";
    });
    document.querySelector(".popup_section .popup_holder").addEventListener('click', function (event) {
        event.stopPropagation();
    });

    // add event listeners which open the popups
    //



    window.show_popup = show_popup;
}



function link_open_scrollto() {
    const links = document.querySelectorAll('a'),
        popup = document.querySelector(".popup_section");
    function click_handler(event) {
        event.preventDefault();
        if (window.getComputedStyle(popup).display !== 'none') {
            // if the link is pressed from a mobile device, the popup should be closed so.
            popup.style.display = 'none';
        }
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        console.log(targetId);
        if (targetElement) {

            if (targetId === "popup") {
                //show popup
                window.show_popup("nav_data_holder");
                let popup_links = document.querySelectorAll('.nav_holder .nav_item');
                console.log(popup_links);
                popup_links.forEach(link => {
                    link.addEventListener('click', click_handler);
                });
                return;
            }

            gsap.to(window, {
                duration: 1,
                scrollTo: {
                    y: targetElement,
                    offsetY: 0
                },
                ease: "power2.out"
            });
        } else {
            const url = this.getAttribute('href');
            window.open(url, '_blank');
        }
    }
    links.forEach(link => {
        link.addEventListener('click', click_handler);
    });
}








/* about page start*/
function about_func() {
    const about_section = document.querySelector(".about_section"),
        about_headding = document.querySelector(".about_section h1");

    gsap.to(about_section, {
        scrollTrigger: {
            trigger: about_section,
            start: "clamp(top bottom)",
            end: "clamp(bottom bottom)",
            snap: [0, 1],
        },
    });
}
/* about page end*/









/* facilities page start*/
function facilities_func() {

    const facility_section = document.querySelector(".facility_section"),
        facility_headding = document.querySelector(".facility_section>.hero>h1");

    gsap.to(facility_section, {
        scrollTrigger: {
            trigger: facility_section,
            start: "clamp(top bottom)",
            end: "clamp(bottom bottom)",
            snap: [0, 1],
        },
    });

    let facility_tl = gsap.timeline({
        scrollTrigger: {
            trigger: facility_headding,
            start: "clamp(top 60%)",
            end: "clamp(bottom top)",
            toggleActions: 'play none none reset',
        }
    });

    facility_tl.from(".facility_section>.hero p", { opacity: 0 });
    facility_tl.from(".facility_section>.services h2", { opacity: 0 }, "<");
    facility_tl.from(".facility_section>.services .card", { opacity: 0, stagger: .2, yPercent: 20 }, "<");


}
/* facilities page end*/









/* gallary page start*/
function gallary_func() {
    const galary_section = document.querySelector(".galary_section"),
        gal_h1 = document.querySelector(".galary_section .fl_item:first-child .headding");

    gsap.to(galary_section, {
        scrollTrigger: {
            trigger: galary_section,
            start: "clamp(top bottom)",
            end: "clamp(bottom bottom)",
            snap: [0, 1],
        },
    });

    gsap.to(gal_h1, {
        scrollTrigger: {
            trigger: gal_h1,
        }
    });

    let mm = gsap.matchMedia();
    mm.add("(min-width: 800px)", () => {
        gsap.utils.toArray(".galary_section .item").forEach((item) => {
            if (item.getAttribute("not_img") == 1) {
                console.log(item)
                return;
            }
            gsap.to(item, {
                scale: 1.1,
                zIndex: 100,
                border: "1px solid white",
                scrollTrigger: {
                    scroller: ".galary_section",
                    horizontal: true,
                    trigger: item,
                    start: "clamp( center center)",
                    end: "clamp( left left)",
                    toggleActions: "play reset play reset"
                }
            })
        });
    });
}
/* gallary page end*/








/* review page start*/
function review_func() {
    const review_section = document.querySelector(".review_section"),
        review_headding = document.querySelector(".review_section>.container>.review-header h1");
    gsap.to(review_section, {
        opacity: 1,
        scrollTrigger: {
            trigger: review_section,
            start: "clamp(top bottom)",
            end: "clamp(bottom bottom)",
            snap: [0, 1],
        },
    });

    // new review submission
    document.getElementById('reviewForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const userNameInput = document.getElementById('user_name');
        const reviewContentInput = document.getElementById('review_content');
        const user_name = userNameInput.value;
        const review_content = reviewContentInput.value;
        const csrftoken = getCookie('csrftoken');
        fetch('/submit-review/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': csrftoken
            },
            body: new URLSearchParams({
                'user_name': user_name,
                'review_content': review_content
            })
        })
            .then(response => response.json())
            .then(data => {
                const messageDiv = document.getElementById('reviewResponseMessage');
                if (data.message) {
                    messageDiv.innerHTML = `<p style="color: green;">${data.message}</p>`;
                } else if (data.error) {
                    messageDiv.innerHTML = `<p style="color: red;">${data.error}</p>`;
                }

                userNameInput.value = '';
                reviewContentInput.value = '';
            })
            .catch(error => console.error('Error:', error));
    });

}
/* review page end*/








/* contact page start */
function contact_func() {
    const contact_section = document.querySelector(".contact_section"),
        contact_header = document.querySelector(".contact_section>.container .header ");

    gsap.to(contact_section, {
        zIndex: 100,
        opacity: 1,
        scrollTrigger: {
            trigger: contact_section,
            start: "clamp(top bottom)",
            end: "clamp(bottom bottom)",
            snap: [0, 1],
        },
    });

    let mm = gsap.matchMedia();
    mm.add("(max-width: 799px)", () => {
        gsap.to(contact_header, {
            opacity: 0,
            zIndex: -1,
            scrollTrigger: {
                trigger: ".contact_section",
                pin: true,
                toggleActions: "play none none, reset",
                snap: 1
            }
        });
    });

    const callAppElement = document.querySelector(".call_app");

    if (callAppElement !== null) {
        callAppElement.addEventListener("click", (event) => {
            show_popup("contact_call_data_holder");
        });
    }
}
/* contact page start */








/* footer page start*/
function footer_func() {
    const footer_section = document.querySelector(".footer_section");

    gsap.to(footer_section, {
        scrollTrigger: {
            trigger: footer_section,
            start: "clamp(top bottom)",
            end: "clamp(bottom bottom)",
            snap: [0, 1],
        }
    });
}
/* footer page end*/










document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin)
    const lenis = new Lenis()
    function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)


    popup_func();
    link_open_scrollto();
    about_func();
    facilities_func();
    gallary_func();
    review_func();
    contact_func();
    footer_func();

    // hide loader
    show_loading(false);


});





window.show_loading = show_loading;
