var feeds = [
                  { name: 'Jason Meckley', url: 'http://jasonmeckley.blogspot.com/feeds/posts/default?alt=rss' }
                , { name: 'Ayende Rahien', url: 'http://feeds.feedburner.com/AyendeRahien?format=xml' }
                , { name: 'Code Better', url: 'http://feeds.feedburner.com/CodeBetter?format=xml' }
                , { name: 'Los Techies', url: 'http://feeds.feedburner.com/LosTechies?format=xml' }
                , { name: 'Fermented Artistry', url: 'http://www.fermentedartistry.com/feed/' }
            ];

$(document).ready(function () {
    var $addFeedDialog = $('#addfeed');
    var $feedName = $(':text', $addFeedDialog);
    var $addFeedDialogButtons = $addFeedDialog.find(':submit, a');
    var $addButton = $('body > a');
    var $feeds = $('#feeds');

    var resetForm = function () {
        $addFeedDialog.resetForm();
    };

    var showAddFeedDialog = function (event) {
        event.preventDefault();
        $addFeedDialog.dialog('open');
    };

    var closeAddFeedDialog = function (event) {
        event.preventDefault();
        $addFeedDialog.dialog('close');
    };

    var newFeedOptions = {
        beforeSubmit: function () {
            $addFeedDialogButtons.button('disable');
        },
        success: function (feed) {
            var renderedFeed = $('#feed-template').render(feed);
            $feeds.append(renderedFeed).accordion('destroy').accordion();
        },
        complete: function () {
            $addFeedDialogButtons.button('enable');
            $addFeedDialog.dialog('close');
        }
    };

    var autocompleteOptions = {
        source: function (request, response) {
            var results = [];

            var populateResults = function () {
                if (this.name.indexOf(request.term) == -1) return;
                results.push(this);
            };
            var transformResults = function () {
                return { label: this.name, value: this.name, url: this.url };
            }

            $(feeds).each(populateResults);
            response($(results).map(transformResults));
        },
        select: function (event, ui) {
            $feedName.next().val(ui.item.url);
        }
    };

    $feeds.accordion();
    $feedName.autocomplete(autocompleteOptions);
    $addButton.click(showAddFeedDialog).button();
    $addFeedDialog.dialog({ modal: true, autoOpen: false, width: 'auto', close: resetForm }).ajaxForm(newFeedOptions);
    $addFeedDialogButtons.button().filter('a').click(closeAddFeedDialog);
});