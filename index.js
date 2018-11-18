/**
 *
 * 20181117-18 スポーツ x ヘルスケア x 北海道 ハッカソン用デモスキル
 *
 **/

'use strict';
const Alexa = require('alexa-sdk');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';

//Resources
const APP_ID = '***';  	    //Alexaサービス側ID
const F_VOICE = '***';    	//デモ用音声（30秒）
const F_TITLELOGO = '***';  //起動時ロゴ
const F_NAYOROU = '***';    //運動中画像
const F_OTSUKARE = '***';   //終了時画像

//Voice
const SKILL_NAME = 'スマートけんぽ';
const V_MSG_LAUNCH = '名寄「スマートけんぽ」アプリです。今日も楽しく運動しましょう。今から何分間運動しますか？';
const V_MSG_LAUNCH_R = '今から何分間運動しますか？';
const C_MSG_LAUNCH = '何分間運動しますか？';
const V_MSG_REPEAT = 'もう一度お願いします。何分間運動しますか？';
const V_MSG_REPEAT_R = '何分間運動しますか？';
const C_MSG_REPEAT = '何分間運動しますか？';
const V_MSG_START = '分間ですね。';
const C_MSG_START = '分間の運動を行いましょう';
const V_MSG_GOAL = '運動をつづけますか？';
const V_MSG_GOAL_R = '運動をつづけますか？';
const V_MSG_FINISH1 = '今日は';
const V_MSG_FINISH2 = '分間運動しましたね。';
const C_MSG_FINISH = 'お疲れ様でした';
const V_MSG_HELP = 'このスキルでは、名寄市の皆さんの健康増進をお手伝いします。運動したい時間を分単位で教えてください。';
const V_MSG_HELP_R = '運動したい時間を分単位で教えてください。';
const V_MSG_STOP = 'お疲れ様でした。';

//Display Interface
const makeImage = Alexa.utils.ImageUtils.makeImage;

//DEBUG MODE
const DEBUG = true;

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

/**
 * 
 * state = unhandled
 * 
 */
var handlers = {
    'Unhandled': function () {
        console.log('<<<handlers.Unhandled>>>');

        this.emit('LaunchRequest');
    },
    'LaunchRequest': function () {
        console.log('<<<handlers.LaunchRequest>>>');
        // 運動量をリセット
        this.attributes['total'] = 0;

        // 次ステートを設定
        this.handler.state = '_MAIN';

        // Inferface別レスポンス生成
        // Voice Interface
        var speechOutput = V_MSG_LAUNCH;
        var reprompt = V_MSG_LAUNCH_R;

        // Display Interface
        if ( this.event.context.System.device.supportedInterfaces.Display ) {
            if ( DEBUG ) { console.log('Display Interface'); }
            var builder = new Alexa.templateBuilders.BodyTemplate7Builder();
            var template = builder.setImage(makeImage(F_TITLELOGO))
                                .setTitle(C_MSG_LAUNCH)
					        	.build();
            this.response.renderTemplate(template);
        }

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        this.response.speak(V_MSG_HELP).listen(V_MSG_HELP_R);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(V_MSG_STOP);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(V_MSG_STOP);
        this.emit(':responseReady');
    },
};

/**
 * 
 * state = main
 * 
 */
var mainHandlers = Alexa.CreateStateHandler('_MAIN', {
    'Unhandled': function () {
        console.log('<<<mainHandlers.Unhandled>>>');

        this.emit(':ask', V_MSG_LAUNCH_R );
    },
    'StartIntent': function () {
        console.log('<<<mainHandlers.StartIntent>>>');
        // 運動量の更新
        var minutes = Number(this.event.request.intent.slots.minutes.value);
        
        // 数値がNaN または 1～30以外はもう一度
        if (( this.event.request.intent.slots.minutes.value == null) || ((minutes<1) || (minutes>30))) {
            // Voice Interface
            var speechOutput = V_MSG_REPEAT;
            var reprompt = V_MSG_REPEAT_R;

            // Display Interface
            if ( this.event.context.System.device.supportedInterfaces.Display ) {
                if ( DEBUG ) { console.log('Display Interface'); }
                var builder = new Alexa.templateBuilders.BodyTemplate7Builder();
                var template = builder.setImage(makeImage(F_TITLELOGO))
                                    .setTitle(C_MSG_REPEAT)
			    		        	.build();
                this.response.renderTemplate(template);
            }

            this.response.speak(speechOutput).listen(reprompt);
            this.emit(':responseReady');
        }
        
        var total = Number(this.attributes['total']);
        total += minutes;
        this.attributes['total'] = total;

        // 次ステートを設定
        this.handler.state = '_CONTINUE';

        // Inferface別レスポンス生成
        // Voice Interface
        var speechOutput = minutes.toString(10) + V_MSG_START;
        speechOutput += "<audio src='" + F_VOICE + "' />";
        speechOutput += "<break time ='500ms' />";
        speechOutput += V_MSG_GOAL;
        var reprompt = V_MSG_GOAL_R;

        // Display Interface
        if ( this.event.context.System.device.supportedInterfaces.Display ) {
            if ( DEBUG ) { console.log('Display Interface'); }
            var builder = new Alexa.templateBuilders.BodyTemplate7Builder();
            var template = builder.setImage(makeImage(F_NAYOROU))
                                .setTitle(minutes.toString(10) + C_MSG_START)
					        	.build();
            this.response.renderTemplate(template);
        }

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        this.response.speak(V_MSG_HELP).listen(V_MSG_HELP_R);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        console.log('<<<mainHandlers.CancelIntent>>>');
        var speechOutput = "";

        // Display Interface
        if ( this.event.context.System.device.supportedInterfaces.Display ) {
            if ( DEBUG ) { console.log('Display Interface'); }
            var builder = new Alexa.templateBuilders.BodyTemplate7Builder();
            var template = builder.setImage(makeImage(F_OTSUKARE))
                                .setTitle(C_MSG_FINISH)
					        	.build();
            this.response.renderTemplate(template);
        }

        var total = Number(this.attributes['total']);
        if ( total > 0) {
            speechOutput = V_MSG_FINISH1 + String(total) + V_MSG_FINISH2;
        }
        speechOutput += V_MSG_STOP;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        console.log('<<<mainHandlers.StopIntent>>>');
        var speechOutput = "";

        // Display Interface
        if ( this.event.context.System.device.supportedInterfaces.Display ) {
            if ( DEBUG ) { console.log('Display Interface'); }
            var builder = new Alexa.templateBuilders.BodyTemplate7Builder();
            var template = builder.setImage(makeImage(F_OTSUKARE))
                                .setTitle(C_MSG_FINISH)
					        	.build();
            this.response.renderTemplate(template);
        }

        var total = Number(this.attributes['total']);
        if ( total > 0) {
            speechOutput = V_MSG_FINISH1 + String(total) + V_MSG_FINISH2;
        }
        speechOutput += V_MSG_STOP;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
});

/**
 * 
 * state = continue
 * 
 */
var continueHandlers = Alexa.CreateStateHandler('_CONTINUE', {
    'Unhandled': function () {
        console.log('<<<countinueHandlers.Unhandled>>>');

        // 次ステートを設定
        this.handler.state = '_MAIN';
        this.emit(':ask', V_MSG_LAUNCH_R );
    },
    'AMAZON.YesIntent': function () {
        console.log('<<<countinueHandlers.YesIntent>>>');

        // 次ステートを設定
        this.handler.state = '_MAIN';

        // Inferface別レスポンス生成
        // Voice Interface
        var speechOutput = V_MSG_LAUNCH_R;
        var reprompt = V_MSG_LAUNCH_R;

        // Display Interface
        if ( this.event.context.System.device.supportedInterfaces.Display ) {
            if ( DEBUG ) { console.log('Display Interface'); }
            var builder = new Alexa.templateBuilders.BodyTemplate7Builder();
            var template = builder.setImage(makeImage(F_TITLELOGO))
                                .setTitle(C_MSG_LAUNCH)
					        	.build();
            this.response.renderTemplate(template);
        }

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.NoIntent': function () {
        // Display Interface
        if ( this.event.context.System.device.supportedInterfaces.Display ) {
            if ( DEBUG ) { console.log('Display Interface'); }
            var builder = new Alexa.templateBuilders.BodyTemplate7Builder();
            var template = builder.setImage(makeImage(F_OTSUKARE))
                                .setTitle(C_MSG_FINISH)
					        	.build();
            this.response.renderTemplate(template);
        }

        var total = Number(this.attributes['total']);
        var speechOutput = "";
        if ( total > 0) {
            speechOutput = V_MSG_FINISH1 + String(total) + V_MSG_FINISH2;
        }
        speechOutput += V_MSG_STOP;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        this.response.speak(V_MSG_HELP).listen(V_MSG_HELP_R);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        console.log('<<<countinueHandlers.CancelIntent>>>');
        var total = Number(this.attributes['total']);
        var speechOutput = "";

        // Display Interface
        if ( this.event.context.System.device.supportedInterfaces.Display ) {
            if ( DEBUG ) { console.log('Display Interface'); }
            var builder = new Alexa.templateBuilders.BodyTemplate7Builder();
            var template = builder.setImage(makeImage(F_OTSUKARE))
                                .setTitle(C_MSG_FINISH)
					        	.build();
            this.response.renderTemplate(template);
        }

        if ( total > 0) {
            speechOutput = V_MSG_FINISH1 + String(total) + V_MSG_FINISH2;
        }
        speechOutput += V_MSG_STOP;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        console.log('<<<countinueHandlers.StopIntent>>>');
        var total = Number(this.attributes['total']);
        var speechOutput = "";

        // Display Interface
        if ( this.event.context.System.device.supportedInterfaces.Display ) {
            if ( DEBUG ) { console.log('Display Interface'); }
            var builder = new Alexa.templateBuilders.BodyTemplate7Builder();
            var template = builder.setImage(makeImage(F_OTSUKARE))
                                .setTitle(C_MSG_FINISH)
					        	.build();
            this.response.renderTemplate(template);
        }

        if ( total > 0) {
            speechOutput = V_MSG_FINISH1 + String(total) + V_MSG_FINISH2;
        }
        speechOutput += V_MSG_STOP;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
});

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers, mainHandlers, continueHandlers);
    alexa.execute();
};
