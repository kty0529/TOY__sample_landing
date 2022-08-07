(sample_landing = function() {
  const elm = {
    header: document.querySelector('#header'),
    secSlider: document.querySelector('.sec-slider')
  }

  const theme = {
    color: 'light',
    slideChange: function(slider) {
      // 슬라이드가 변경될 때에 따라 헤더의 테마를 변경해줍니다.
      const t = this;

      let activeSlider = slider.slides[ slider.activeIndex ];
      let sliderTheme = activeSlider.dataset.sliderTheme;

      t.color = sliderTheme;
      elm.secSlider.dataset.theme = t.color;

      if ( ! elm.header.classList.contains('fixed') ) {
        elm.header.dataset.sliderTheme = t.color;
      }
    }
  };

  /**
   * 헤더 제어
   */
  const header = {
    scrollEvent: function() {
      // 스크롤 위치에 따라 header에 fixed 추가
      const t = this;

      if ( window.scrollY > 100 ) {
        elm.header.classList.add('fixed');
      } else {
        elm.header.classList.remove('fixed');

        // fixed가 풀렸을 때, 슬라이더의 변화에 맞게 헤더 테마 변경
        if ( theme.color != '' ) {
          elm.header.dataset.sliderTheme = theme.color;
        }
      }
    }
  }

  // 헤더 스크롤 이벤트
  header.scrollEvent();
  window.addEventListener('scroll', function(e) {
    header.scrollEvent();
  });

  // 헤더 네비게이션 이벤트
  const header_link = document.querySelectorAll('#header .navigation a');
  header_link.forEach(function(elm) {
    elm.addEventListener('click', function(e) {
      e.preventDefault();

      const sectionId = this.getAttribute('href');
      document.querySelector(sectionId).scrollIntoView({behavior: 'smooth'});
    });
  });


  /**
   * section - slider
   */
  const sec01_slider = new Swiper('.sec-slider .swiper', {
    loop: false,
    slidesPerView: 1,
    autoplay: {
      delay: 3000,
    },
    allowTouchMove: false,
    parallax: true,
    speed: 1000,
    pagination: {
      el: '.sec-slider .pagination .container',
      bulletClass: 'pagination-bullet',
      bulletActiveClass: 'pagination-bullet-active',
      clickable: true,
      renderBullet: function(index, className) {
        return '<button class="' + className + ' ' + ( className + ( '0' + ( index + 1 ) ) ) + '"></button>';
      }
    },
    on: {
      init: function(swiper) {
        theme.slideChange(swiper);
      },
      slideChange: function(swiper) {
        theme.slideChange(swiper);
      },
    }
  });


  /**
   * section - project
   */
  const sec02_project_action = function(data, image) {
    const zoomInDom = document.querySelector('.sec-project .zoom-in');

    zoomInDom.querySelector('.title').innerHTML = data.title;
    zoomInDom.querySelector('.desc').innerHTML = data.desc;
    zoomInDom.querySelector('.external').setAttribute('href', data.url);
    zoomInDom.style.backgroundImage = `url('${image}')`;
  }

  const sec02_project_slider = new Swiper('.sec-project .slider-area .swiper', {
    loop: true,
    slidesPerView: 2.7116,
    loopAdditionalSlides: 6,
    spaceBetween: 15,
    navigation: {
      nextEl: '.sec-project .slider-navigation .next',
    },
    on: {
      init: function() {
        const activeSlider = this.slides[ this.activeIndex ];
        const data = JSON.parse( activeSlider.dataset.set );
        const image = activeSlider.querySelector('img').src;

        sec02_project_action(data, image);
      },
      slideChange: function() {
        const activeSlider = this.slides[ this.activeIndex ];
        const data = JSON.parse( activeSlider.dataset.set );
        const image = activeSlider.querySelector('img').src;

        sec02_project_action(data, image);
      }
    }
  });


  /**
   * section - team
   */
  var Tab = function(container) {
    this.container  = document.querySelector(container);
    this.navigation = this.container.querySelector('.tab-navigation');
    this.wrapper    = this.container.querySelector('.tab-wrapper');

    this.navAction = function(p) {
      let btns = p.navigation.querySelectorAll('a');
      btns.forEach(function(elm) {
        elm.addEventListener('click', function(e) {
          e.preventDefault();
          let target = elm.getAttribute('href').replace('#', '');
          let parent = elm.parentNode;

          if ( ! parent.classList.contains('active') ) {
            parent.parentNode.querySelector('.active').classList.remove('active');
            parent.classList.add('active');

            p.wrapper.querySelector('[data-tab-id].active').classList.remove('active');
            p.wrapper.querySelector('[data-tab-id="'+target+'"]').classList.add('active');
          }
        })
      });
    }

    this.run = function() {
      this.navAction(this);
    };

    return this.run();
  }

  // 탭 생성
  const tabs = new Tab('.tab-container');

  // 탭 내 ajax 반복
  const user = document.querySelectorAll('[data-user]');
  user.forEach(function(elm, idx) {
    const dataSet = JSON.parse(elm.dataset.user);
    const results = dataSet.results;
    const gender = dataSet.gender;
    const lists = elm.querySelector('.lists');
    let position;

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === xhr.DONE) {
        if (xhr.status === 200 || xhr.status === 201) {
          const data = JSON.parse(xhr.response);

          let item = ''; // string 으로 초기화

          for ( let i = 0; i < data.results.length; i++ ) {
            const output = data.results[i];
            let rank;

            switch (idx) {
              case 0:
                position = 'Designer';

                switch (i) {
                  case 0: rank = 'Lead '; break;
                  case 1: rank = 'Senior '; break;
                  case 2: rank = 'Junior '; break;
                }
              break;

              case 1:
                position = 'Developer';

                switch (i) {
                  case 0: rank = 'Senior '; break;
                  case 1: rank = 'Junior '; break;
                }
              break;

              case 2:
                position = 'Developer';
                rank = 'Front-end ';
              break;
            }

            item += `<li>
                      <div class="user">
                        <div class="user-thumb" style="background-image: url(${output.picture.large});"></div>
                          <div class="user-name">
                            <div class="name">${output.name.last} ${output.name.first}</div>
                            <div class="position">${rank}${position}</div>
                          </div>
                          <div class="user-actions">
                            <a class="action email" href="mailto:${output.email}"><span class="material-symbols-outlined icon">outgoing_mail</span></a>
                            <a class="action phone" href="tel:${output.phone}"><span class="material-symbols-outlined icon">call</span></a>
                            <span class="action gender">
                              <span class="material-symbols-outlined icon">${output.gender == 'female' ? 'female' : 'male'}</span>
                            </span>
                          </div>
                        </div>
                    </li>`;
          }

          lists.innerHTML = item;
        } else {
          console.error(xhr.response);
        }
      }
    };

    xhr.open('GET', `https://randomuser.me/api/?results=${results}&gender=${gender}`);
    xhr.send();
  });


  /**
   * section - contactus
   */

  // form의 submit 이벤트를 훔쳐와 커스텀 이벤트 실행
  document.querySelector('.sec-contact form').onsubmit = (event) => {
    // form 필드 가져오기
    const username = event.target.elements.username;
    const email = event.target.elements.email;
    const message = event.target.elements.message;

    // form 유효성 검사
    if ( username.value == '' ) {
      alert('Company or Your-name is required.');
      username.focus();

      return false;
    }

    if ( email.value == '' ) {
      alert('Email is required.');
      email.focus();

      return false;
    }

    if ( message.value == '' ) {
      alert('Message is required.');
      message.focus();

      return false;
    }

    // 폼 필드에 오류가 없으면 success 처리
    alert('Success');

    return false;
  }
})();
