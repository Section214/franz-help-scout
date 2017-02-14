const path = require('path');

module.exports = (Franz, options) => {
	Franz.injectCSS(path.join(__dirname, 'css', 'franz.css'));

	function copyToClipboard(elem) {
		let targetId = '_hiddenURLField';
		let origSelectionStart, origSelectionEnd;
		let target = document.getElementById(targetId);

		if(!target) {
			target = document.createElement('textarea');
			target.style.position = 'absolute';
			target.style.left = '-9999px';
			target.style.top = '0';
			target.id = targetId;
			document.body.appendChild(target);
		}

		target.textContent = window.location.href;

		let currentFocus = document.activeElement;

		target.focus();
		target.setSelectionRange(0, target.value.length);

		document.execCommand('copy');

		if(currentFocus && typeof currentFocus.focus === 'function') {
			currentFocus.focus();
		}
	}

	function getMessages() {
		let mine = '';
		let unassigned = '';
		let total = '0';

		if ($('.convo-toolbar').length) {
			if (! $('#copyLink').length) {
				$('#actions-dd .more').append('<li class="actions-dd"><a id="copyLink" class="actions-dd">Copy Link</a></li>');
				$('.c-convo-toolbar').after('<div class="link-copied" style="display: none">Ticket URL copied to clipboard!<a id="closeLink">x</a></div>');
			}
		}

		$('#copyLink').on('click', function(e) {
			e.preventDefault();

			copyToClipboard();

			$('.link-copied').fadeIn('fast').css('display', 'block');
		});

		$('#closeLink').on('click', function(e) {
			e.preventDefault();

			$('.link-copied').fadeOut('fast', function () {
				$(this).css('display', 'none');
			});
		})

		if ($('.dropdown.mailboxes').length && $('.dropdown.mailboxes a').hasClass('active')) {
			mine = $('li.mine a .badge').text();
			unassigned = $('li.unassigned a .badge').text();
		} else if (window.location.href === 'https://secure.helpscout.net/dashboard/') {
			mine = 0;
			unassigned = 0;

			$('.card.mailbox .c-list').each(function() {
				let m = $(this).find('a:nth-child(2)').find('.count').text();
				let u = $(this).find('a:first-child').find('.count').text();

				if ($.isNumeric(m)) {
					mine += parseInt(m);
				}

				if ($.isNumeric(u)) {
					unassigned += parseInt(u);
				}
			});

			mine = mine.toString();
			unassigned = unassigned.toString();
		}

		if (mine !== '') {
			total = mine;
		}

		if (unassigned !== '') {
			total = total + '/' + unassigned;
		}

		Franz.setBadge(total);
	}

	Franz.loop(getMessages);
};
