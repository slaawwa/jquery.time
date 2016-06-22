# jquery.time
My first jquery plugin - jquery.time.js

## Attr `data-time`:

```html
	<i id="#needTime" data-time="1466601527165"></i>
	<script>
		$('#needTime').time();
	</script>
```

## Script variant 1 without params:

```html
	<i id="#needTime"></i>
	<script>
		$('#needTime').time();
	</script>
```

## Script variant 2 with param:

```html
	<i id="#needTime"></i>
	<script>
		var timeStamp = new Date().getTime();
		$('#needTime').time({time: timeStamp});
	</script>
```

## Script variant 3 with param:

```html
	<i id="#needTime"></i>
	<script>
		var timeStamp = new Date().getTime();
		$('#needTime').data('time', timeStamp).time();
	</script>
```

## Params
```sh
+===========+======================+=================================+
| PARAM     | DEFAULT VALUE        | DESCRIPTION                     |
+===========+======================+=================================+
| time      | new Date().getTime() | timeStamp                       |
+===========+======================+=================================+
| withAt    | false                | desc after time                 |
+===========+======================+=================================+
| showPast  | true                 | show timer if it is past        |
+===========+======================+=================================+
| pastLabel | ''                   | What show if showPast is `true` |
+===========+======================+=================================+
```

### Version
1.0.1
