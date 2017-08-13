'use strict';

module.exports = {
    client: {
        lib: {
            css: [
                'public/lib/bootstrap/dist/css/bootstrap.min.css',
                'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',

                'public/lib/d3/LineChart.css'
            ],
            js: [
                'public/lib/angular/angular.min.js',
                'public/lib/angular-resource/angular-resource.min.js',
                'public/lib/angular-animate/angular-animate.min.js',
                'public/lib/angular-messages/angular-messages.min.js',
                'public/lib/angular-ui-router/release/angular-ui-router.min.js',
                'public/lib/angular-ui-utils/ui-utils.min.js',
                'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
                'public/lib/angular-file-upload/angular-file-upload.min.js',
                'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
                'public/lib/angularjs-dragdrop/src/angular-dragdrop.js',
                'public/lib/lodash/dist/lodash.js',
                'public/lib/angular-dropdown-multiselect/src/angularjs-dropdown-multiselect.js',
                'public/lib/jquery/dist/jquery.js',
                'public/lib/jquery-ui/jquery-ui.js',
                'public/lib/angular-dragdrop/src/angular-dragdrop.js',
                'public/lib/d3/d3.js',
                'public/lib/d3/LineChart.js',
                'public/lib/moment/src/moment.js'
            ]
        },
        css: 'public/dist/application.min.css',
        js: 'public/dist/application.min.js'
    }
};
