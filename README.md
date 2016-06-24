# jquery.time

>My first jquery plugin - ***jquery.time.js***

> It's plugin for sweety transform and ***`auto refresh`*** time/date`(timeStamp)`

# So, result look like this:

 * 2 min ago
 * In 29 sec at 3:55am
 * In 29 sec
 * 2 hours ago at 4:18pm
 * Tomorow at 3:59pm
 * Tomorow at 4:02pm
 * Tomorow at 2:03pm
 * In 5 days at June 17th
 * October 20th 2011
 * October 20th 2017
 * September 20th 2011
 * 32 min ago at 6:05pm

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
+=============+======================+====================================+
| PARAM       | DEFAULT VALUE        | DESCRIPTION                        |
+=============+======================+====================================+
| time        | new Date().getTime() | timeStamp                          |
+=============+======================+====================================+
| withAt      | false                | desc after time                    |
+=============+======================+====================================+
| showPast    | true                 | show timer if it is past           |
+=============+======================+====================================+
| pastLabel   | ''                   | What show if showPast is `false`   |
+=============+======================+====================================+
| showFuture  | true                 | show timer if it is future         |
+=============+======================+====================================+
| futureLabel | ''                   | What show if showFuture is `false` |
+=============+======================+====================================+
```

## Sync with server time

### Set server defference time and local time

```html
    <script>
        $(document).time('serverDefTime', serverLocalDefTime);
    </script>
    <!-- 

        Full example can look like this  

    -->
    <script>
        var syncServerTime = function(fn) {
            var startTime = new Date().getTime();
            $.getJSON('/api/server_utc', function(response) {
                var finishTime = new Date().getTime(),
                    defTime = 0.5 * (finishTime - startTime);
                fn(defTime, response.utc_time - defTime);
            });
        };

        syncServerTime(function(defTime) {
            $(document).time('serverDefTime', serverLocalDefTime);
        });
    </script>
```


### Get server defference time

```html
    <script>
        $(document).time('serverDefTime');
    </script>
```

### Set server time

```html
    <script>
        $(document).time('setServerTime', serverTimeStamp);

        // If server return time without milisecond
        $(document).time('setServerTime', serverTimeStamp, true);
        // It`s some if you do serverTimeStamp
        serverTimeStamp *= 1000;
        $(document).time('setServerTime', serverTimeStamp);
    </script>
```
### Get server time

```html
    <script>
        // return timeStamp
        var serverTimeStamp = $(document).time('getServerTime');
        alert('Server Time Stamp: ' + serverTimeStamp);

        // Or get only difference local and server time
        var timeDefStamp = $(document).time('getServerTime', true);
        alert('Defference time: ' + timeDefStamp + 'ms');
    </script>
```
### Version
1.0.4
