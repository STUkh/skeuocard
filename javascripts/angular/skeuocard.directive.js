'use strict';

function skeuocard ($timeout) {
    'ngInject';
    
    return {
        restrict: 'E',
        scope: {
            card: '='
        },
        template: '<form id="co-payment-form" style="display: block;"><div class="credit-card-input no-js center-block" id="skeuocard"> <p class="no-support-warning"> Either you have Javascript disabled, or you\'re using an unsupported browser. </p> <label for="cc_type">Card Type</label> <select name="cc_type" id="cc_type"> <option value="">...</option> <option value="visa">Visa</option> <option value="discover">Discover</option> <option value="mastercard">MasterCard</option> <option value="maestro">Maestro</option> <option value="jcb">JCB</option> <option value="unionpay">China UnionPay</option> <option value="amex">American Express</option> <option value="dinersclubintl">Diners Club</option> </select> <label for="cc_number">Card Number</label> <input type="text" name="cc_number" id="cc_number" placeholder="XXXX XXXX XXXX XXXX" maxlength="19" size="19" data-stripe="number"> <label for="cc_exp_month">Expiration Month</label> <input type="text" name="cc_exp_month" data-stripe="exp-month" id="cc_exp_month" placeholder="00"> <label for="cc_exp_year">Expiration Year</label> <input type="text" name="cc_exp_year" data-stripe="exp-year" id="cc_exp_year" placeholder="00"> <label for="cc_name">Cardholder\'s Name</label> <input type="text" name="cc_name" id="cc_name" data-stripe="name" placeholder="John Doe"> <label for="cc_cvc">Card Validation Code</label> <input type="text" name="cc_cvc" data-stripe="cvc" id="cc_cvc" placeholder="123" maxlength="3" size="3"> </div> </form>',
        link: function (scope, elem, attrs) {
            $timeout(function () {
                var cardInstance = new Skeuocard($(elem).find('#skeuocard'), { initialValues: { cvc: '000' } });
                if (attrs.card) {
                    scope.card = cardInstance;
                }
                cardInstance.bind('faceValidationStateDidChange.skeuocard', function () {
                    emitSkeuocardChange(cardInstance);
                });

            });

            function emitSkeuocardChange(card) {
                scope.$emit('skeuocard:validationChange', card);
            }
        }
    }
}
export default skeuocard;
