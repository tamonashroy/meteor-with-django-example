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
		var data = Article.find({});
		return data;
	}
   });
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
}
