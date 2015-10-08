FlowRouter.route('/', {
   action: function() {
   BlazeLayout.render("mainLayout", {content: "ArticleList"});
  }
});

FlowRouter.route('/article/:articleid', {
      action: function() {
      BlazeLayout.render("mainLayout", {content: "DetailPage"});
   }
});
Article = new Mongo.Collection("articles");
if (Meteor.isClient) {
   Template.DetailPage.helpers({
	article: function() {
		var articleid = FlowRouter.getParam("articleid");
		var data = Article.findOne({articleid: parseInt(articleid)});
		return data;
	}
   });
   Template.WhatToReadNext.helpers({
	articles: function() {
		var data = Article.find().fetch();
		var pn = Article.findOne({'doc': 1}).pageno;
		var items = data.slice(pn*4, pn*4+4)
		return items;
	}
   });
   /*Template.WhatToReadNext.onRendered(function() {
	// This is run once and set the page no to 0. This value is used to determine 
	// which block of 4 set to show in the what to read next section.
	//Article.update({'doc':1}, {$set:{'pageno':0}});
	console.log(Article.findOne({doc:1}));
	var a=Article.findOne({doc:1});
	Session.set('page', a._id);
	console.log("set pageno session"+session.get('page'));
   });*/
   Template.ArticleList.helpers({
	article: function() {
		var data = Article.findOne({articleid: 1});
		return data;
	},
	articles: function() {
		var data = Article.find({});
		return data;
	}  
   });
   Template.WhatToReadNext.events({
	   'click #next': function(event){
		   console.log("Click event in next happened");
		   var pageInfoDoc = Article.findOne({'doc':1});
		   Session.set('page', pageInfoDoc._id)
		   var pageNo = pageInfoDoc.pageno;
		   console.log("Page number now is " + pageNo);
		   var noRec = Article.find().count();
		   console.log("No of recs now is " + noRec);
		   var maxPageNo = Math.ceil(noRec / 4);
		   console.log("Max Page No " + maxPageNo);
		   if (pageNo < maxPageNo-1) {
			console.log("no errors here");
			Article.update(Session.get('page'), {$inc: {pageno:1}});
		}
	   },
	   'click #prev': function(event){
                   Meteor.call('logme', function(err, res){ 
                       if (err) {
                        console.log("err"+err);
                        }
                       else {
                        console.log(res);
                    }});
		   console.log("Click event in next happened");
		   var pageInfoDoc = Article.findOne({'doc':1});
		   Session.set('page', pageInfoDoc._id)
		   var pageNo = pageInfoDoc.pageno;
		   console.log("Page number now is " + pageNo);
		   if (pageNo > 0) {
			Article.update(Session.get('page'), {$inc: {pageno:-1}});
		}
	   }
   });
  Meteor.methods({
        log1:function() {console.log("log45");}
		
        }); 
}
if (Meteor.isServer) {
	Meteor.startup(function() {
	Meteor.methods({
		'fetch': function() {
		   var url = "http://tamonashroy.pythonanywhere.com/articles";
                   var res = HTTP.get(url);
                   var w = res.content;
                   var respJson = JSON.parse(w);
		   console.log("response received.");
				for (i=0; i<respJson.length; i++){
					var temp = respJson[i].id;
					if (!Article.findOne({'id': temp})) {
						Article.insert(respJson[i]);
					}

				}
		},
		startPolling: function(seconds){
        		pollingTaskID = Meteor.setInterval(function(){
            		Meteor.call('fetch');
        		}, seconds*1000);
        		return "polling started...";
    		}
		
	});
        Meteor.call('startPolling', 30);

});
}

