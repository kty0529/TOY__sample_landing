(sample_landing = function() {
	/**
	 * Header
	 */
	const header = {
		elm: document.querySelector('#header'),
		theme: '',
		sliderEvent: function(slider) {
			// 슬라이더 init, slideChange 이벤트에 따른 액션
			const t = this;

			let activeSlider = slider.slides[ slider.activeIndex ];
			let getHeaderTheme = activeSlider.dataset.headerTheme;

			t.theme = getHeaderTheme;

			if ( ! t.elm.classList.contains('fixed') ) {
				t.elm.setAttribute('data-header-theme', t.theme);
			}
		},
		scrollEvent: function() {
			// 스크롤 위치에 따라 header에 fixed 추가
			const t = this;

			if ( window.scrollY > 100 ) {
				t.elm.classList.add('fixed');
			} else {
				t.elm.classList.remove('fixed');

				// fixed가 풀렸을 때, 슬라이더의 변화에 맞게 헤더 테마 변경
				if ( t.theme != '' ) {
					t.elm.setAttribute('data-header-theme', t.theme);
				}
			}
		},
		anchor: function(target) {
			// gnb 메뉴 클릭 시 anchor 이동
			target = target.replace('#', '#sec-');
			document.querySelector(target).scrollIntoView({behavior: 'smooth'});
		}
	}

	// header scroll
	header.scrollEvent();
	window.addEventListener('scroll', function(e) {
		header.scrollEvent();
	});

	// header navigation
	const header_link = document.querySelectorAll('#header .nav a');
	header_link.forEach(function(elm, idx) {
		elm.addEventListener('click', function(e) {
			e.preventDefault();

			const target = this.getAttribute('href');
			header.anchor(target);
		});
	});


	/**
	 * section - slider
	 */
	const sec01_slider = new Swiper('.sec-slider .swiper-container', {
		loop: true,
		slidesPerView: 1,
		effect: 'fade',
		speed: 1000,
		autoplay: true,
		on: {
			init: function(swiper) {
				header.sliderEvent(swiper);
			},
			slideChange: function(swiper) {
				header.sliderEvent(swiper);
			},
		}
	});


	/**
	 * section - project
	 */
	const sec02_project_action = function(slider) {
		const zoomIn = document.querySelector('.sec-project .zoom-in');

		let activeSlider = slider.slides[ slider.activeIndex ];
		let data = JSON.parse( activeSlider.dataset.set );
		let title = data.title;
		let desc = data.desc;
		let url = data.url;

		// zoom-in 엘리먼트에 변경될 값 적용
		zoomIn.querySelector('.title').innerHTML = title;
		zoomIn.querySelector('.desc').innerHTML = desc;
		zoomIn.querySelector('.external').setAttribute('href', url);
		zoomIn.style.backgroundImage = getComputedStyle(activeSlider).backgroundImage;
	}

	const sec02_project_slider = new Swiper('.sec-project .slider-area .swiper-container', {
		loop: true,
		slidesPerView: 1,
		loopAdditionalSlides: 6,
		spaceBetween: 15,
		navigation: {
			prevEl: '.sec-project .slider-navigation .prev',
			nextEl: '.sec-project .slider-navigation .next',
		},
		on: {
			init: function(swiper) {
				sec02_project_action(swiper);
			},
			slideChange: function(swiper) {
				sec02_project_action(swiper);
			},
			click: function(swiper, event) {
				let index = parseInt( event.target.dataset.swiperSlideIndex );
				swiper.slideToLoop(index);
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
			btns.forEach(function(elm, idx) {
				elm.addEventListener('click', function(e) {
					e.preventDefault();
					let target = elm.getAttribute('href');
						target = target.replace('#', '');
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
		let dataSet = JSON.parse(elm.dataset.user);
		let results = dataSet.results;
		let gender  = dataSet.gender;
		let lists   = elm.querySelector('.lists');
		let position;

		$.ajax({
			url: 'https://randomuser.me/api/',
			dataType: 'json',
			data: {
				'results': results,
				'gender' : gender ? gender : '',
			},
			success: function(data) {
				// console.log(data);

				let item = '';

				for ( let i = 0; i < data.results.length; i++ ) {
					let output = data.results[i];
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

					item += '<li>';
					item += '	<div class="user">';
					item += '		<div class="user-thumb" style="background-image: url(\'' + output.picture.large + '\');"></div>';
					item += '		<div class="user-name">';
					item += '			<div class="name">' + output.name.last + ' ' + output.name.first + '</div>';
					item += '			<div class="position">' + rank + position + '</div>';
					item += '		</div>';
					item += '		<div class="user-actions">';
					item += '			<a class="action email" href="mailto:' + output.email + '"><i class="far fa-envelope"></i></a>';
					item += '			<a class="action phone" href="tel:' + output.phone + '"><i class="fas fa-phone"></i></a>';
					item += '			<a class="action gender" href="javascript:void(0);">';
					item += '				<i class="fas fa-' + ( output.gender == 'female' ? 'venus' : 'mars' ) + '"></i>';
					item += '			</a>';
					item += '		</div>';
					item += '	</div>';
					item += '</li>';

				}

				lists.innerHTML = item;
			}
		});
	})


	/**
	 * section - contactus
	 */
	document.querySelector('.sec-contact form').onsubmit = (event) => {
		// form 엘리먼트 가져오기
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

		// 메일 보내기
		// mailto의 body 에서 내용 줄바꿈을 하려면 %0D%0A 을 사용하면 됩니다.
		message.value = message.value.replace('\n', '%0D%0A');
		window.open('mailto:kty0529@gmail.com?subject=[프로젝트 의뢰] Request Project&body=Company or Your-name: ' + username.value + '%0D%0AEmail: ' + email.value + '%0D%0AMessage: ' + message.value, '_blank');

		return false;
	}
})();
