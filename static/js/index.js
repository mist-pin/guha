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



function update_nav_colors(active_element, background_color) {
  const navLinks = document.querySelectorAll(".navigation_section>.section_container>.container>.item"),
    navbar = document.querySelector(".navigation_section");

  navLinks.forEach(link => {
    if (link.classList.contains(active_element)) {
      gsap.to(link, {
        color: "var(--secondary-color)",
        textShadow: "1px 1px 1px white",
        duration: 0.5
      });
    }
    else {
      gsap.to(link, {
        color: 'var(--primary-color)',
        textShadow: "0px 0px 0px var(--ternary-color)",
      });
    }
  });

  if (background_color) {
    gsap.to(navbar, { backgroundColor: background_color, duration: 1 });
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





/* intro page start*/
function intro_func() {
  let zoom_section = document.getElementsByClassName("intro_section_0"),
    zoom_image = document.querySelector(".intro_section_0 .see_through>picture>img"),
    intro_section = document.getElementsByClassName("intro_section"),
    intro_headding = document.querySelector(".intro_section .container_1 .headding"),
    intro_sub_headding = document.querySelector(".intro_section .container_1 .sub_headdng");
  gsap.to(zoom_image, {
    scale: 50,
    ease: "power1.out",
    scrollTrigger: {
      trigger: zoom_section,
      pin: true,
      snap: [0, 1],
      pinSpacing: false,
      scrub: 1,
      onEnter: () => { update_nav_colors('hme') },
      onLeave: () => { gsap.to(intro_section, { opacity: 1 }); gsap.to(zoom_section, { opacity: 1, }); },
      onEnterBack: () => { gsap.to(zoom_section, { opacity: 1, duration: 1 }); gsap.to(intro_section, { opacity: 0, duration: 0 }), update_nav_colors('hme') }
    },
  });


  // let mm = gsap.matchMedia();
  // mm.add("(max-width: 799px)", () => {

  // });

  let intro_tl = gsap.timeline({
    ease: "none",
    scrollTrigger: {
      trigger: intro_section,
      start: "clamp(top, top)",
      snap: 1,
      scrub: 2,
      pin: true,
      onEnterBack: () => {
        update_nav_colors('hme');
        /*
          * on returning to the top page, check if the top navbar contains items and the bottom one doesnt.
          * if so change the items to bottom containers
          * else do notheing.
        */
        if (document.querySelector(".navigation_section .container").hasChildNodes()) {
          nav_items = gsap.utils.toArray(".navigation_section .item"),
            document.querySelector(".intro_section .container_0>ul").innerHTML = "";
          nav_items.forEach(element => {
            let li = document.createElement("li");
            li.appendChild(element);
            document.querySelector(".intro_section .container_0>ul").appendChild(li);
          });
        }
      }
    },
  });
  intro_tl.fromTo(intro_headding,
    { "--before-left": "-120%", duration: 2 },
    {
      "--before-left": "160%", "--before-width": "100px", "--before-height": "300px", duration: 2,
      onComplete: () => { gsap.to(intro_headding, { "--before-opacity": "0", duration: 1, delay: 1 }) }
    });
  intro_tl.to(intro_sub_headding, {
    visibility: "visible", ease: "none", text: "A better night for your sleep", delay: .1,
    onStart: () => {
      if (document.querySelector(".intro_section .container_0 li").hasChildNodes()) {
        nav_items = gsap.utils.toArray(".intro_section .container_0 a"),
          nav_items.forEach(element => {
            document.querySelector(".navigation_section>.section_container>.container").appendChild(element);
          });
      }
    }
  });
  intro_tl.from(".intro_section>.section_container>.container>.container_2", {
    opacity: 0,
    duration: 1,
  }, "+=1");


  let intro_tl_2 = gsap.timeline({
    // opacity: 0,
    // duration: 1,
    scrollTrigger: {
      trigger: ".intro_section .container_1 .headding",
      start: "clamp(top 70%)",
    }
  });
  intro_tl_2.from(".intro_section .container_1", {
    opacity: 0,
    duration: 1,
  });
  intro_tl_2.to(".intro_section .container_0", {
    opacity: 0,
  }, "<");
};
/* intro page end*/










/* about page start*/
function about_func() {
  const about_section = document.querySelector(".about_section"),
    about_headding = document.querySelector(".about_section h1"),
    mm = gsap.matchMedia();

  gsap.to(about_section, {
    scrollTrigger: {
      trigger: about_section,
      start: "clamp(top bottom)",
      end: "clamp(bottom bottom)",
      snap: [0, 1],
      onEnter: () => { update_nav_colors('abt') },
    },
  });

  let about_tl = gsap.timeline({
    scrollTrigger: {
      trigger: about_headding,
      start: "clamp(top center)",
      end: "bottom top",
      toggleActions: 'play none none reset',
      onEnterBack: () => { update_nav_colors('abt') },
      onLeaveBack: () => { update_nav_colors('hme') },
    }
  });
  about_tl.from(".about_section .container", { opacity: 0 });
  mm.add("(min-width: 800px)", () => {
    about_tl.from(".about_section .img_holder>img", { scale: .9, yPercent: 20, opacity: .7 }, "<");
    about_tl.from(".about_section .content_holder", { scale: .9, yPercent: 20, opacity: .3 }, "<");
  });
}
/* about page end*/









/* facilities page start*/
function facilities_func() {

  const facility_section = document.querySelector(".facility_section"),
    facility_headding = document.querySelector(".facility_section>.hero>h1"),
    mm = gsap.matchMedia();

  gsap.to(facility_section, {
    scrollTrigger: {
      trigger: facility_section,
      start: "clamp(top bottom)",
      end: "clamp(bottom bottom)",
      snap: [0, 1],
      onEnter: () => { update_nav_colors('fclt') },
    },
  });

  let facility_tl = gsap.timeline({
    scrollTrigger: {
      trigger: facility_headding,
      start: "clamp(top 60%)",
      end: "clamp(bottom top)",
      toggleActions: 'play none none reset',
      onEnterBack: () => { update_nav_colors('fclt') },
    }
  });

  facility_tl.from(".facility_section>.hero p", { opacity: 0 });
  facility_tl.from(".facility_section>.services h2", { opacity: 0 }, "<");
  mm.add("(min-width: 800px)", () => {
    facility_tl.from(".facility_section>.services .card", { opacity: 0, stagger: .2, yPercent: 20 }, "<");
  });


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
      onEnter: () => { update_nav_colors('glry') },
      onEnterBack: () => { update_nav_colors('glry') },
    },
  });

  gsap.to(gal_h1, {
    scrollTrigger: {
      trigger: gal_h1,
      onEnterBack: () => { update_nav_colors('glry') },
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








/*faq page start */
function faq_func() {
  const faq_section = document.querySelector(".faq_section"),
    faq_headding = document.querySelector(".faq_section h1"),
    mm = gsap.matchMedia();

  gsap.to(faq_section, {
    scrollTrigger: {
      trigger: faq_section,
      start: "clamp(top bottom)",
      end: "clamp(bottom bottom)",
      snap: [0, 1],
      onEnter: () => { update_nav_colors('fqs') },
    },
  });

  gsap.to(faq_section, {
    opacity: 1,
    scrollTrigger: {
      // pin: true,
      // pinSpacing: false,
      trigger: faq_section,
      onEnterBack: () => { update_nav_colors('fqs') },
    }
  });

  let faq_tl = gsap.timeline({
    scrollTrigger: {
      trigger: faq_headding,
      start: "clamp(top 60%)",
      end: "clamp(bottom bottom)",
      toggleActions: 'play none none reset',
    }
  });

  faq_tl.from(".faq_section .search-bar", { opacity: 0 });
  mm.add("(min-width: 800px)", () => {
    faq_tl.from(".faq_section>.container .option-card", { opacity: 0, stagger: .2, yPercent: 20 }, "<");
  });


  // to get the faq based on types
  async function fetch_faqs(faqGroup) {
    try {
      const response = await fetch('/get-faqs/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          faq_group: faqGroup
        }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.length > 0) {
        const faqContainer = document.createElement("div");
        faqContainer.classList.add("faq_list_holder");
        data.forEach(faq => {
          const listItem = document.createElement("div");
          listItem.innerHTML = `
            <div class="faq_list_item" style="border-bottom:1px solid black; margin-bottom:5px; margin-left:10px; margin-right:10px;">
              <h3>${faq.question}</h3>
              <p style="width:100%">${faq.answer}</p>
            </div>
          `;
          faqContainer.appendChild(listItem);
        });
        show_popup(`${faqContainer.innerHTML}`, true);
      } else {
        show_popup(`no faqs found`, true)
      }
    } catch (error) {
      alert("error occured");
    }
  }

  // to ask a question
  document.getElementById('faqForm').addEventListener('submit', (e) => {
    e.preventDefault();
    show_loading();
    const questionInput = document.getElementById('question');
    const question = questionInput.value;
    const csrftoken = getCookie('csrftoken');

    fetch('/submit-faq/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-CSRFToken': csrftoken
      },
      body: new URLSearchParams({
        'question': question
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          alert(`${data.message}`);
        } else if (data.error) {
          alert(`${data.error}`);
        }
        questionInput.value = '';
        show_loading(false);
      })
      .catch(error => console.error('Error:', error));
  });


  // set listeners on all faq group cards:
  const cards = document.querySelectorAll(".faq_section>.container .option-card");
  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      const key = card.querySelector("p").innerText;
      fetch_faqs(key);
    })
  });


}
/*faq page end */








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
      onEnter: () => { update_nav_colors('rvw') },
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
      onEnter: () => { update_nav_colors('cntct') },
      onEnterBack: () => { update_nav_colors('rvw') },
      onLeaveBack: () => { update_nav_colors('rvw') },
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

  mm.add("(max-width: 799px)", () => {
    document.querySelectorAll('.galary_section .item').forEach(parent => {
      parent.addEventListener('click', function () {
        const child = parent.querySelector('.headding');
        if (child.style.visibility === 'hidden') {
          child.style.visibility = 'visible';
        } else {
          child.style.visibility = 'hidden';
        }
      });
    });
  });

  const callAppElement = document.querySelector(".call_app");
  const mapAppElement = document.querySelector(".map_app");

  if (callAppElement !== null) {
    callAppElement.addEventListener("click", (event) => {
      show_popup("contact_call_data_holder");
    });
  }
  if (mapAppElement !== null) {
    mapAppElement.addEventListener("click", (event) => {
      show_popup("contact_map_data_holder");
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

  // lenis scroll smoother integration
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
  intro_func();
  about_func();
  facilities_func();
  gallary_func();
  faq_func();
  review_func();
  contact_func();
  footer_func();

  // hide loader
  show_loading(false);


});





window.show_loading = show_loading;
window.update_nav_colors = update_nav_colors;