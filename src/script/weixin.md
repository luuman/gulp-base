<script type="text/javascript" src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
<script type="text/javascript">
    // 微信分享到朋友圈的内容和图片的定制
    wx.config({
        debug: false,
        appId: 'wxdcb447934ddf8be6',
        timestamp: '<?php echo $timestamp ?>',
        nonceStr: '<?php echo $noncestr; ?>',
        signature: '<?php echo $sign ?>',
        jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo'
        ]
      });
    wx.ready(function(){
        wx.onMenuShareTimeline({
          title: otitle, // 分享标题
          link: otargetUrl, // 分享链接
          imgUrl: oiconUrl, // 分享图标
          success: function (res) {
              // 用户确认分享后执行的回调函数
          },
          cancel: function () {
              // 用户取消分享后执行的回调函数
          }
        });
        wx.onMenuShareAppMessage({
            title: otitle, // 分享标题
            desc: ocontent, // 分享描述
            link: otargetUrl, // 分享链接
            imgUrl: oiconUrl, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
        wx.onMenuShareQQ({
            title: otitle, // 分享标题
            link: otargetUrl, // 分享链接
            imgUrl: oiconUrl, // 分享图标
            success: function () {
               // 用户确认分享后执行的回调函数
            },
            cancel: function () {
               // 用户取消分享后执行的回调函数
            }
        });
    });
</script>