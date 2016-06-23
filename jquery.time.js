$(function() {
	/*  
		Made by Slaawwa (c) 22-06-2016
		Helper: https://habrahabr.ru/post/158235/
	 */
	/* private variables */
	var now = new Date(), 
		dayInTime = 24 * 60 * 60 * 1000, 
		opt = {
			setVal: function(key, val) {
				opt[key] = val;
			},
			refresh: function() {
				t = new Date();
				opt.now = t.getTime();
				opt.nowYear = t.getFullYear();
			},
			debug: true,
			now: now.getTime(),
			nowYear: now.getFullYear(),
			level2fn: [
				't2sec', // 0
				't2min', // 1
				't2hour', // 2
				't2tomorrowORyesterday', // 3
				't2days', // 4
				't2date', // 5
			],
			level2refresh: [
				1000, // 0
				60 * 1000, // 1
				60 * 60 * 1000, // 2
				dayInTime, // 3
				dayInTime, // 4
				dayInTime, // 5
			],
			level2time: [
				1000, // 0 -> 1 sec
				60000, // 1 -> 1 min (60 * 1000)
				3600000, // 2 -> 1 hour (60 * 60 * 1000)
				86400000, // 3 -> 1 day (24 * 60 * 60 * 1000)
				172800000, // 4 -> 2 days (2 * 24 * 60 * 60 * 1000)
				691200000, // 5 -> 8 days (8 * 24 * 60 * 60 * 1000)
			],
			months: [
				"January", "February", "March",
				"April", "May", "June",
	    		"July", "August", "September",
	    		"October", "November", "December"
	    	],
		};
	/* private variables */

	/* private helper methods */
	var _helper = {
		toStr: function(timeObj, cnf) {
			if (!cnf.showPast && timeObj.past) {
				return cnf.pastLabel;
			}
			if (!cnf.showFuture && !timeObj.past) {
				return cnf.futureLabel;
			}
			var fn = opt.level2fn[timeObj.level];
			return _helper.time[fn](timeObj, cnf); 
		},
		time: {
			t2sec: function(timeObj, cnf) {
				var ret = timeObj.val = Math.round((timeObj.defTime / 1000 /* opt.level2time[0] */) % 60);
				if (timeObj.past) {
					ret = ret + ' sec ago';
				} else {
					ret = 'In ' + ret + ' sec';
				}
				if (cnf.withAt) {
					ret = ret + ' at ' + _helper.time.t2amORpm(timeObj);
				}
				timeObj.text = ret;
				return ret;
			},
			t2min: function(timeObj, cnf) {
				var ret = timeObj.val = Math.round(timeObj.defTime / 60000 /* opt.level2time[1] */); // 60 * 1000
				if (timeObj.past) {
					ret = ret + ' min ago';
				} else {
					ret = 'In ' + ret + ' min';
				}
				if (cnf.withAt) {
					ret = ret + ' at ' + _helper.time.t2amORpm(timeObj);
				}
				timeObj.text = ret;
				return ret;
			},
			t2hour: function(timeObj, cnf) {
				var ret = timeObj.val = Math.round(timeObj.defTime / 3600000 /* opt.level2time[2] */), // 60 * 60 * 1000
					hourText = ' hour'+(ret == 1? '': 's');
				if (timeObj.past) {
					ret = ret + hourText + ' ago';
				} else {
					ret = 'In ' + ret + hourText;
				}
				if (cnf.withAt) {
					ret = ret + ' at ' + _helper.time.t2amORpm(timeObj);
				}
				timeObj.text = ret;
				return ret;
			},
			t2tomorrowORyesterday: function(timeObj, cnf) {
				var ret;
				if (timeObj.past) {
					ret = 'Tomorow';
				} else {
					'Yestarday'
				}
				timeObj.val = ret;
				if (cnf.withAt) {
					ret = ret + ' at ' + _helper.time.t2amORpm(timeObj);
				}
				timeObj.text = ret;
				return ret;
			},
			t2days: function(timeObj, cnf) {
				var days = parseInt(timeObj.defTime / 86400000 /* opt.level2time[3] */), 
					ret;
				if (timeObj.past) {
					ret = days + ' days ago';
				} else {
					ret = 'In ' + days + ' days';
				}
				timeObj.val = days;
				if (cnf.withAt) {
					ret = ret + ' at ' + _helper.time.t2date(timeObj, cnf);
				}
				timeObj.text = ret;
				return ret;
			},
			t2date: function(timeObj, cnf) {
				var month = opt.months[timeObj.date.getMonth()],
					day = _helper.time._t2date( timeObj.date.getDate() ),
					year = opt.nowYear == timeObj.date.getFullYear()? '': ' '+timeObj.date.getFullYear(),
					ret = month + ' ' + day + year;
				if (!timeObj.val) {
					timeObj.val = timeObj.text = ret;
				}
				return ret;
			},
			num2: function(num) {
				return num> 9? num: '0'+num;
			},
			num1: function(num) {
				return num> 12? num - 12: num;
			},
			t2amORpm: function(timeObj) {
				var ret = _helper.time.num1(timeObj.date.getHours()) + ':'
					    + _helper.time.num2(timeObj.date.getMinutes());
				if (timeObj.date.getHours() > 11) {
					ret = ret + 'pm';
				} else {
					ret = ret + 'am';
				}
				return ret;
			},
			_t2date: function(dateNumber) {
				var ret = 'th';
				if ([11, 12, 13].indexOf(dateNumber) !== -1) {
					switch(dateNumber % 10) {
						case 1: ret = 'st';
						case 2: ret = 'nt';
						case 3: ret = 'rd';
					}
				}
				return dateNumber + ret;
			},
		},
		extend: function(time) {
			var resTime = _helper.extendInfo(time), intTime = resTime.defTime;
            // Seconds
            if (intTime < 60000 /* opt.level2time[1] */) { // 60 * 1000
                resTime.level = 0;

            // Minutes
            } else if (intTime < 3600000 /* opt.level2time[2] */) { // 60 * 60 * 1000
                resTime.level = 1;

            // Hours
            } else if (intTime < 86400000 /* opt.level2time[3] */) { // 24 * 60 * 60 * 1000
                resTime.level = 2;

            // Tomorow/Yestarday
            } else if (intTime < 172800000 /* opt.level2time[4] */) { // 2 * 86400000
                resTime.level = 3;

            // 2-7 days
            } else if (intTime < 691200000 /* opt.level2time[5] */) { // 8 * 86400000
                resTime.level = 4;
            // Date (June 8[th])
            } else {
                resTime.level = 5;
            }
            return resTime;
		},
		extendInfo: function(time) {
			var t = opt.now - time, d = {time: time};
			d.past = t>0;
			d.defTime = d.past? t: -1*t;
			d.date = new Date(time);
			return d;
		},
		getRefreshTime: function(extDate) {
			var refreshTime = opt.level2refresh[extDate.level];
			if (!extDate.past && extDate.level > 0) {
				refreshTime = extDate.defTime % opt.level2time[extDate.level];
			}
			if ((extDate.past && extDate.level == 5)) {
				refreshTime = 0;
			}
			return refreshTime;
		},
		getIntelectualRefresh: function(extDate, opts, successFn) {
			if (opts.showPast || !extDate.past) {
				var refreshTime = _helper.getRefreshTime(extDate);
				if (refreshTime) {
					return setTimeout(successFn, refreshTime);
				}
			}
		},
		setting: function(opts, data) {
			var ar = $.extend({
		      	withAt: false,
		      	time: new Date().getTime(),
		      	showPast: true,
		      	showFuture: true,
		      	futureLabel: '',
		      	pastLabel: '',
		    }, data);
			return $.extend(ar, opts);
		},
		refresh: function(opts) {
			opt.refresh();
			return methods.init.apply(this, [opts]);
		},
	};
	/* private helper methods */

	/* private methods */
	var methods = {
		start: function(opts) {
			methods.init.apply(this, [opts]);
			return this;
		},
		stop: function() {
			clearTimeout(this.data('timer'));
			return this;
		},
		init: function( opts ) {
			return this.each(function() {
				var data = {}
				if ($(this).data('time')) data.time = $(this).data('time');
				var cnf = _helper.setting(opts, data);
				var $this = $(this), extDate = _helper.extend(cnf.time);
				if (opt.debug) {
					var json = 'extDate: ' + (JSON.stringify(extDate)
						.replace(/\,\"/igm, '\,\n\t\<b\>\"')
						.replace('\{\"', '\{\n\t\<b\>\"')
						.replace(/\":/igm, '\"\<\/b\>: ')
						.replace('\}', '\n\}'));
					$this
						.html('Level('+extDate.level+') - ' + _helper.toStr(extDate, cnf))
						.attr('title', extDate.date);
					if ($this.data('jsonExist')) {
						$this.next().html('<pre>'+json+'</pre>')
					} else {
						$this.data('jsonExist', 1);
						$this.after('<pre>'+json+'</pre>')
					}
				} else {
					$this.html(_helper.toStr(extDate, cnf));
				}
				clearTimeout($this.data('timer'));
				var timerID = _helper.getIntelectualRefresh(extDate, cnf, function() {
					opt.refresh();
					methods.init.apply($this, [cnf]);
				});
				$this.data('timer', timerID);
		    });
		},
		setTime: function(opts) {
			if (typeof opts !== 'object') opts = {time: opts};
			this.data('time', opts.time);
			_helper.refresh.apply(this, [opts]);
			return this;
		},
		test: function(opts) {
			var debug = opt.debug;
			if (!opts.withoutDebug) {
				opt.setVal('debug', true);
			}
			opts = $.extend({
				// sel: 'html',
				el: $('<div></div>'),
				time: new Date().getTime(),
			}, opts);
			opts.el.data('time', opts.time);
			this.append(opts.el);
			opts.el.time(opts);
			opt.setVal('debug', debug);
		},
	};
	/* private methods */

	$.fn.time = function( method ) {
	    if ( methods[method] ) {
	    	var opts = Array.prototype.slice.call( arguments, 1 );
	      	return methods[method].apply( this, opts);
	    } else if ( typeof method === 'object' || ! method ) {
	      	return methods.init.apply( this, arguments );
	    } else {
	      	$.error( 'Метод (' +  method + ') відсутній в jQuery.time' );
	    }
	}
});
