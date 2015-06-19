var Marionette = require('backbone.marionette'),
    $ = require('jquery'),
    _ = require('lodash'),
    helpers = require('../utils/helpers'),
    template = require('templates/work.hbs'),
    Masonry = require('masonry-layout'),
    ImageLoaded = require('image-loaded'),
    BaseLayoutView = require('./BaseLayoutView');

app.registerPreloader('work', {
    collections: ['projects'],
    waitCount: 0
}, function (projects) {
    return projects.pluck('file');
});

module.exports = BaseLayoutView.extend({

    className: 'page page-work',

    template: template,

    templateHelpers: function () {
        return {
            projects: this.collection.toJSON()
        };
    },

    ui: {
        image: 'img',
        filterNavLink: '.filter-nav-link',
        workItem: '.item'
    },

    events: {
        'click @ui.filterNavLink': 'handleFilter'
    },

    initialize: function () {},

    onRender: function () {
        _.defer(_.bind(function () {
            helpers.setMeta(this.options.title);
        }, this));
    },

    onShow: function () {
        helpers.scrollTo('.header');
        
        var masonry = new Masonry('.work-container', {
            itemSelector: '.item',
            columnWidth: '.item',
            percentPosition: true
        });

        this.imageArray = [];

        _.each(this.ui.image, _.bind(function(image) {
            this.imageArray.push(image);
        }, this));

        _.each(this.imageArray, _.bind(function(image, i) {
            if (i === (this.imageArray.length - 1)) {
                console.log('test');
                setTimeout(_.bind(function() {
                    ImageLoaded(image, function(err, alreadyLoaded){
                        masonry.layout();
                    });
                }, this), 500);
            }
        }, this));
    },

    handleFilter: function (e) {
        var $currentTarget = $(e.currentTarget);
        this.ui.filterNavLink.removeClass('filter-active');
        $currentTarget.addClass('filter-active');

        this.ui.workItem.addClass('hidden');

        _.each(this.ui.workItem, _.bind(function(workItem) {
            var $workItem = $(workItem)
            if ($workItem.hasClass('Front-end')) {
                
            }
        }, this));
    }

});
