$(function(){
    $.ajaxSetup({
        'headers':  {
                'X-CSRFToken':  getCookie('csrftoken')
        },
        'url':      '/blog/ajax/',
    });
    
    
    if($('div.main').attr('data-blogMode') == 'blogentry')  setInterval(checkNewComments,15000);
    if($('div.main').attr('data-blogMode') == 'blogpage')   setInterval(updateCommentsNumberOnlyAllPosts,15000);
    if($('div.post.post_addpost').length)                   setInterval(checkNewGrabbings,15000);
    
    new Image().src= '/static/img/misc/loading.png'; // Пусть закеширует картинку
    
    $('img[alt=right]').wrap('<span class="float-right" />').attr('alt','');
    $('img[alt=left]') .wrap('<span class="float-left" />') .attr('alt','');
    // TODO: надо написать для md отдельное расширение
    
    
    function showLoadingOver(a) {
        $('div#loading').css(a.offset()).width(a.outerWidth()).height(a.outerHeight()).show()
    }
    
    function hideLoading() {
        $('div#loading').hide();
    }
    
    function popError(a) {
        $('div#error').stop(1,1).hide().text(a).css({left:($(window).width()-$('div#error').width())/2,top:($(window).height()-$('div#error').height())/2}).fadeIn(200).delay(600).fadeOut(200);
    }
    
    
    function updateCommentsNumberOnlyAllPosts() {
        ids     = Array()
        $('div#post').each(function(){
            ids.push($(this).attr('data-postId'));
        });
        
        $.ajax({
            'type':     'GET',
            
            'data':     {
                'ajax_operation':   'updateCommentsNumberOnlyMultipleIds',
                'post_ids':          ids.join('+'),
            },
            'dataType': 'json',
            
            'success':  function(data,textStatus,res) {
                if(data.status == 'ok') {
                    for(var i = 0; i < ids.length; i++) {
                        $('div#post[data-postId="'+ids[i]+'"] span#post-thin-header-comments-num').text((function(a){ if (a>0) return ' ('+a+')'; return ''; })(data.data[ids[i]]));
                    }
                }
            },
        });
    }
    
    function insertComment(comment_data) {
        first_comment = $('#post_comment').first()
        first_comment.clone().render(comment_data,
                        {
                        '#comment_username':    'username',
                        '@data-datetime':       'datetime',
                        '@data-commentId':      'id',
                        '#comment-datetime':    'datetime_hr',
                        '#comment-content':     'content',
                        }).hide().insertBefore(first_comment).slideDown(500);
        
        if( $('div#comments_header #num_comments').text() &&
            $('div#comments_header').css('display') != 'none')  num_comments = parseInt($('div#comments_header #num_comments').text());
        else                                                    num_comments = 0;
        $('div#comments_header').render({a:num_comments+1},
                        {
                        '#num_comments':    'a',
                        });
        
        if($('div#comments_header').css('display') == 'none') {
            $('div#comments_header').slideDown(500);
        }
        
        $('span#post-thin-header-comments-num').text(' ('+(num_comments+1)+')');
    }
    
    function removeComment(comment) {
        comment.slideUp(500,function(){ comment.remove(); });
        
        num_comments = parseInt($('div#comments_header #num_comments').text());
        
        num_comments--;
        
        if(num_comments > 0) { // TODO: Зарефакторить эту функцию и верхнюю с учётом отдельной функции для обновления комментариев.
            $('div#comments_header').render({a:num_comments},
                            {
                            '#num_comments':    'a',
                            });
            
            $('span#post-thin-header-comments-num').text(' ('+(num_comments)+')');
        }
        else {
            $('div#comments_header').slideUp(500);
            $('span#post-thin-header-comments-num').text('');
        }
    }
    
    
    $('a#comment_submit').click(function(){
        submitCommentsForm();
    });
    
    function showCommentForm() { // Да-да, я знаю ((
        $('form#comment   textarea[name=content]').example('Текст комментария вводится сюда',{className:'form_example'});
        
        $('form#comment').slideDown(500);
        $('a#comment_submit').slideDown(500);
        
        $('a#comment_add').slideUp(100);
    }
    
    function hideCommentForm() {
        $('form#comment').slideUp(500,function(){$('form#comment   textarea[name=content]').val('');});
        $('a#comment_submit').slideUp(500);
        
        $('a#comment_add').slideDown(100);
    }
    
    function submitCommentsForm() {
        showLoadingOver($('div#addcomment_form'));
        
        s = $('form#comment > input, form#comment > textarea').filter(function(){
        return $(this).val() == '' || $(this).val() == $(this).attr('data-exampleText');
        });
        if(s.length > 0) {
        s.addClass('invalid');
        hideLoading();
        popError('Задетектированы пустые поля');
        }
        else {
            $.ajax({
                'type':     'POST',
                
                'data':     {
                    'ajax_operation':   'addPostComment',
                    'post_id':          $('form#comment   input[name=post_id]').val(),
                    'username':         $('form#comment   input[name=username]').val(),
                    'content':          $('form#comment   textarea[name=content]').val(),
                },
                'dataType': 'json',
                
                'success':  function(data,textStatus,res) {
                    if(data.status == 'ok') {
                    insertComment({
                        username:       $('form#comment   input[name=username]').val(),
                        datetime:       data.datetime,
                        datetime_hr:    data.datetime_string,
                        id:             data.id,
                        content:        $('form#comment   textarea[name=content]').val(),
                    });
                    hideCommentForm();
                    }
                    else if(data.status == 'error') {
                        popError(data.error_text);
                    }
                    else {
                        popError('С сервера пришла какая-то хуйня');
                    }
                },
                'error':    function(a,b,c) {
                    popError('Сервер недоступен или что-то типа того');
                },
                'complete': function(a,b) {
                    hideLoading();
                },
            });
        }      
    }
    
    function deletePostComment(commentId) { // TODO: Сделать ajax-проверку удалённых комментариев (СДЕЛАТЬ БЛЯ)
        targetComment   = $('div#post_comment[data-commentId="'+commentId+'"]')
        showLoadingOver(targetComment);
        
        $.ajax({
            'type':     'POST',
            
            'data':     {
                'ajax_operation':   'deletePostComment',
                'comment_id':       commentId,
            },
            'dataType': 'json',
            
            'success':  function(data,textStatus,res) {
                if(data.status == 'ok') {
                    removeComment(targetComment);
                }
                else if(data.status == 'error') {
                    popError('НИУДАЛОСЬ удалить комментарий.');
                }
                else if(data.status == 'unauthorized') {
                    popError('ХУЙ'); // Если не шалить, такого не произойдёт.
                }
                else {
                    popError('С сервера пришла какая-то хуйня');
                }
            },
            'error':    function(a,b,c) {
                popError('Сервер недоступен или что-то типа того');
            },
            'complete': function(a,b) {
                hideLoading();
            },
        });
    }
    
    function checkNewComments() {
        last_comment_datetime = $('#post_comment').first().attr('data-datetime');
        
            
        $.ajax({
        'type':     'GET',
        
        'data':     {
            'ajax_operation':           'checkPostComments',
            'post_id':                  $('form#comment   input[name=post_id]').val(),
            'last_comment_datetime':    last_comment_datetime,
        },
        'dataType': 'json',
        
        'success':  function(data,textStatus,res) {
            if(data.status == 'yaNewComments') { // ))
                for(var i = 0; i < data.comments.length; i++) {
                insertComment(data.comments[i]);
                }
            }
        },
        });
    }
    
    function checkNewGrabbings() { // Для staff-only функций действует сервер-сайд проверка сессии
        last_grabbing_datetime = $('div#post_grabbing').last().attr('data-datetime_local');
            
        $.ajax({
        'type':     'GET',
        
        'data':     {
            'ajax_operation':           'checkPostGrabbings',
            'last_grabbing_datetime':    last_grabbing_datetime,
        },
        'dataType': 'json',
        
        'success':  function(data,textStatus,res) {
            if(data.status == 'yaNewGrabbings') {
                $('div#post_grabbing').first().parent().children('#ajax_list_empty').slideUp(500);
                for(var i = 0; i < data.grabbings.length; i++) {
                    last_grabbing = $('div#post_grabbing').last()
                    last_grabbing.clone().render(data.grabbings[i],
                            {
                                '@data-grabbingId':     'id',
                                '@data-datetime_local': 'datetime_local',
                                '@data-title':          'title',
                                '@data-contents':       'contents',
                                'img@src':              'imgPath',
                                'a span#datetime':      'datetime_remote_srt',
                                'a span#title':         'str',
                            }).hide().insertAfter(last_grabbing).slideDown(500);
                }
            }
        },
        });
    }
    
    
    function fillInThePostAddForm/* 2011 mp3 скачать бесплатно */(title, content, grabbingId) { 
        if(title) $('input#addpost_title').change().val(title);
        else $('input#addpost_title').val(title);
        if(content) $('textarea#addpost_content').change().val(content);
        else $('textarea#addpost_content').val(content);
        
        makeAddPostExamples();
        
        $('input#addpost_grabbing_id').val(grabbingId);
    }
    
    function showThePostAddForm() {
        $('form#addpost').slideDown(500);
        
        $('a#post_add').slideUp(100);
    }
    
    function hideThePostAddForm(a) {
        $('form#addpost').slideUp(500,function(){
            fillInThePostAddForm('','','');
            a();
        });
        
        $('a#post_add').slideDown(100);
    }
    
    function submitThePostForm() {
        showLoadingOver($('form#addpost'));
    
        // Нет проверок, ну ладно
    
        $.ajax({
        'type':     'POST',
        
        'data':     {
            'ajax_operation':       'addPost',
            
            'grabbing_id':      $('input#addpost_grabbing_id').val(),
            'local_title':      $('input#addpost_title').val(),
            'local_content':    $('textarea#addpost_content').val(),
            'local_category':   $('input#addpost_category').val(),
        },
        'dataType': 'json',
        
        'success':  function(data,textStatus,res) {
            if(data.status == 'okay') {
                hideThePostAddForm(function(){history.go(0);});
                 // TODO: Сделать чтоб было аджаксово и с шаблонами
            }
            else if(data.status == 'grabbed_already') {
                popError('Это сообщение уже опубликовано');
            }
            else if(data.status == 'unauthorized') {
                popError('Нет авторизации; походу, печенье слетело');
            }
            else {
                popError('С сервера пришла какая-то хуйня');
            }
        },
        'error':    function(a,b,c) {
            popError('Сервер недоступен или что-то типа того');
        },
        'complete': function(a,b) {
            hideLoading();
        },
        
        });
    }
    
    
    
    $('a#comment_add').click(showCommentForm);
    
    $('input#comment_username').example('Отображаемое имя',{className:'form_example'}).attr('data-exampleText', 'Отображаемое имя');
    $('textarea#comment_content').example('Текст комментария вводится сюда',{className:'form_example'}).attr('data-exampleText', 'Текст комментария вводится сюда');
    // TODO: Это ведь баг, что нельзя отправить сообщение с данными, аналогичными плейсхолдерам.
    
    if($('form#comment').hasClass('errors')) {
        showCommentForm();
        $('form#comment').removeClass('errors');
    }
    
    $('.invalid').live('click',function(){
        $(this).removeClass('invalid');
    });
    
    $('a#comment_delete_link').live('click',function(){
        deletePostComment($(this).parent().parent('div#post_comment').attr('data-commentId'));
    });
    
    
    function makeAddPostExamples() {
        $('input.addpost').example($(this).attr('placeholder'),{className:'form_example'});
        $('textarea.addpost').example($(this).attr('placeholder'),{className:'form_example'});
    }
    makeAddPostExamples();
    
    $('div.ajax_list > a').click(function(){
        $(this).next('div.ajax_list > div').stop(1,1).slideToggle(500);
    });
    
    $('div#awesome_ajax_select').each(function(i,e){
        $(e).append($('<input />',{type:'hidden',name:$(e).attr('data-name'),id:$(e).attr('data-name')}));
    });
    $('div#awesome_ajax_select > a').click(function(){
        $(this).parent('div#awesome_ajax_select').children().removeClass('selected');
        $(this).addClass('selected');
        
        $(this).parent('div#awesome_ajax_select').children('input[type=hidden]').val($(this).attr('data-value'));
    });
    $('div#awesome_ajax_select > a').first().click();
    
    $('div#post_grabbing > a').live('click',function(){
        fillInThePostAddForm($(this).parent('div#post_grabbing').attr('data-title'),
                             $(this).parent('div#post_grabbing').attr('data-contents'),
                             $(this).parent('div#post_grabbing').attr('data-grabbingId')
                             );
        $('textarea#addpost_content').focus()
        $('div#post_clearform').slideDown(500);
    });
    
    $('div#post_clearform').click(function(){
        fillInThePostAddForm('','','');
        $(this).slideUp(500);
    });
    
    $('div#post_translAcc > a#activate');
    
    $('form#addpost a#post_submit').click(function(){
        submitThePostForm();
    });
    
    $('a#post_add').click(function(){
        showThePostAddForm();
    })
    
});
