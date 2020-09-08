$(document).ready(function () {

    let rate_id = $('#buyForm #sale_id').val();
    let promoDiscount = 0;
    let promoTrue = 0;
    let price = 0;
    let finalPrice = 0;


    function initToken() {
        $("#buyForm").each(function (element) {
            var rate_id = $('#sale_id').val();
            $.post('ExternalSale.php?a=init&rate_id=' + rate_id + '', function (data) {
                let d = JSON.parse(data);
                $('#sale_key').val(d.token);
            })

        })
    };

    $('.promo__span').click(function () {

        var promocode = $('#promo').val();
        rate_id = $('#sale_id').val();
        if ($('#promo').val().length >= 1) {
            $.post('ExternalSale.php?rate_id=' + rate_id + '&a=check&promocode=' + promocode + '', function (data) {
                let s = JSON.parse(data);
                promoDiscount = s.discount;
                promoTrue = s.valid;
                if (promoTrue == 1) {
                    $('.promo__span').css('background', 'transparent');
                    $('.promo__span').css('border', 'none');
                    $('.promo__span').css('color', '#58AF32');
                    $('.promo__span').text('✓');
                    price = parseInt($('#offerPrice').text());
                    let proc = (price) / 100;
                    finalPrice = proc * (100 - promoDiscount);
                    $('#offerPrice').text(finalPrice);
                    return $('#offerPrice');
                } else {
                    $('.promo__span').css('background', 'transparent');
                    $('.promo__span').css('border', 'none');
                    $('.promo__span').css('color', '#e9041e');
                    $('.promo__span').text('Не найден');
                    setTimeout(function () {
                        $('#promo').val('');
                        $('.promo__span').css('background', 'transparent');
                        $('.promo__span').css('border', 'solid 2px #e60028');
                        $('.promo__span').css('color', '#282423');
                        $('.promo__span').text('Применить');
                    }, 1000)
                }

            })
        }
    });



    $('#promo').keyup(function () {
        if ($('#promo').val().length >= 1) {
            $('.promo__span').show();
        } else {
            $('.promo__span').hide();
        }
    });



    $("#phone").mask("+7 (999) 999-9999");

    let tariffs = {
        single: {
            price: '1000',
            id: '2817',
            modalText: 'рублей / 3 мес'
        },
        standart: {
            price: '3000',
            id: '2841',
            modalText: 'рублей / год'
        },
        vip: {
            price: '5000',
            id: '2842',
            modalText: 'рублей / год'
        }
    };

    $('.tariff__item_btn').click(function () {

        let tariffName = $(this).data('tariff');
        $('#offerPrice').text(tariffs[tariffName].price);
        $('.offer__price_rub').text(tariffs[tariffName].modalText)
        $('#sale_id').val(tariffs[tariffName].id);
        initToken();

    });

    $('input[name="sale[lastname]"], input[name="sale[name]"], input[name="sale[surname]"]').on('blur', function () {
        $(this).val($(this).val().replace(/[^А-Яа-я\-\s]/g, ''))
    });


    $(document).on('keyup', '.input__mail', function () {
        let email = $(this).val();
        if (email.length > 0 &&
            (email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))) {
            $(this).removeClass('invalid');
        } else if (email.length == 0) {
            $(this).addClass('invalid');
        } else {
            $(this).addClass('invalid');
        }
    });



    $('#offerBtn').click(async (e) => {
        if (($('[name="sale[lastname]"]').val().length > 0) && ($('[name="sale[mobile]"]').val().length > 1) && ($('[name="sale[name]"]').val().length > 0) && ($('[name="sale[surname]"]').val().length > 0) &&
            !($('[name="sale[email]"]').hasClass('invalid')) &&
            ($('#agree').is(':checked'))) {
            e.preventDefault();
            const fd = new FormData();
            fd.append('lastname', $('[name="sale[lastname]"]').val());
            fd.append('mobile', $('[name="sale[mobile]"]').val());
            fd.append('surname', $('[name="sale[surname]"]').val());
            fd.append('email', $('[name="sale[email]"]').val());
            fd.append('name', $('[name="sale[name]"]').val());
            fd.append('dsa', $('[name="creator[created_by_tabel_number]"]').val());
            const url = `send.php`;
            const config = {
                method: 'POST',
                body: fd
            };
             await fetch(url, config);
            $('#buyForm').submit();
        }
    });



    $('#consultationBtn').click(async (e) => {
        e.preventDefault();
        if (!($('[name="sale[email2]"]').hasClass('invalid')) &&
            ($('#agree2').is(':checked'))) {
            const d = $('#consultationEmail').serialize();
            
            $.ajax({
                    type: "POST",
                    url: 'send.php',
                    data: d,
                    success: function (res) {
                        console.log(res)
                    }
            })
            $('.message').hide()
            $('.succsess__message').show();
           
        }
    });

    $('#consultationEmail').change(function () {
        if (
            !($('[name="sale[email2]"]').hasClass('invalid')) &&
            ($('#agree2').is(':checked'))) {

            $('#consultationBtn').css('opacity', '1');
        } else {

            $('#consultationBtn').css('opacity', '0.5');
        }
    });


});


"use strict";

const compareTariffs = document.getElementById('compareTariffs');
const tariffTable = document.querySelector('.tariff__modal');
const body = document.querySelector('.body');
const closeTariff = document.querySelector('.tariff__title_close');
const openConsultation = document.getElementById('interestedIn');
const closeConsultation = document.querySelector('.consultation__title_close');
const consultation = document.querySelector('.consultation');
const tariffLa = document.getElementById('tariffLa');
const tariffNalog = document.getElementById('tariffNalog');
const offerModal = document.querySelector('.offer__modal');
const offerClose = document.getElementById('offerClose');
const tariffContainer = document.querySelector('.container__tariff');
const modalContainer = document.querySelector('.container__consultation');
const subtitleMove = document.querySelectorAll('.tariff__subtitle');
const subtitleArrow = document.querySelectorAll('.tariff__subtitle img');
const sliderLeft = document.querySelector('.Arrow_left');
const sliderRight = document.querySelector('.Arrow_right');
const slider = document.querySelector('.AdditionalSlider__slider');
const burger = document.querySelector('.header__burger_mob');
const burgerMenu = document.querySelector('.header__mob_menu');
const burgerLink = document.querySelectorAll('.header__nav_link_mob');
const burgerClose = document.querySelector('.header__mob_menu_close');
const tariffButton = document.querySelectorAll('.tariff__item_btn');
const overlay      = document.querySelector('#overlay-modal');



let i = 0;

burger.addEventListener('click', mobMenu);

function mobMenu() {
    burgerMenu.style.display = 'block';
    body.style.filter = 'blur(5px)';
};


burgerClose.addEventListener('click', mobLinkScroll);

for (i = 0; i < burgerLink.length; i++) {
    burgerLink[i].addEventListener('click', mobLinkScroll);
};

function mobLinkScroll() {
    burgerMenu.style.display = 'none';
    body.style.filter = 'blur(0px)';
};



function hoverArrow() {
    for (i = 0; i < subtitleMove.length; i++) {
        subtitleMove[i].addEventListener('mouseover', moveArrow);
        subtitleMove[i].addEventListener('mouseout', returnArrow);
    }
};

hoverArrow();


function moveArrow() {
    for (i = 0; i < subtitleArrow.length; i++) {
        subtitleArrow[i].style.transform = "translate(20px,0)";
    }
};

function returnArrow() {
    for (i = 0; i < subtitleArrow.length; i++) {
        subtitleArrow[i].style.transform = "translate(0px,0)";
    }
};

sliderRight.addEventListener('click', moveLeft);
sliderLeft.addEventListener('click', moveRight);

function moveLeft() {
    slider.style.transform = "translate(-400px,0)";
    slider.style.transition = "0.7s";
}

function moveRight() {
    slider.style.transform = "translate(0px,0)";
    slider.style.transition = "0.7s";
}


compareTariffs.addEventListener('click', openTariffTable);

function openTariffTable() {
    body.style.filter = 'blur(5px)';
    overlay.classList.add('active');
    tariffTable.style.display = 'block';
     // Delete scroll window
     document.body.style.overflow = 'hidden';
     document.body.style.marginRight = '15px';
};

closeTariff.addEventListener('click', closeTariffTable);

function closeTariffTable() {
    body.style.filter = 'blur(0px)';
    overlay.classList.remove('active');
    tariffTable.style.display = 'none';
    document.body.style.overflow = '';
    document.body.style.marginRight = '0px';
};

//Close modal on click window

overlay.addEventListener('click', (event) =>{ 
    if(event.target === overlay){
        closeTariffTable();
    }
});

// openConsultation.addEventListener('click', openConsultationModal);

function openConsultationModal() {
    for (i = 0; i < tariffButton.length; i++) {
        tariffButton[i].style.display = 'none';
    }
    body.style.filter = 'blur(5px)';
    consultation.style.display = 'block';
    overlay.classList.add('active');
    // Delete scroll window
    document.body.style.overflow = 'hidden';
    document.body.style.marginRight = '15px';
};

closeConsultation.addEventListener('click', closeConsultationModal);

function closeConsultationModal() {
    for (i = 0; i < tariffButton.length; i++) {
        tariffButton[i].style.display = 'block';
    }
    body.style.filter = 'blur(0px)';
    overlay.classList.remove('active');
    consultation.style.display = 'none';
    document.body.style.overflow = '';
    document.body.style.marginRight = '0px';
};

//Close modal on click window

overlay.addEventListener('click', (event) =>{
    if(event.target === overlay){
        closeConsultationModal ();
    }
});

tariffLa.addEventListener('click', openOfferModal);
tariffNalog.addEventListener('click', openOfferModal);
interestedIn.addEventListener('click', openOfferModal)
offerClose.addEventListener('click', closeOfferModal);

function openOfferModal() {
    for (i = 0; i < tariffButton.length; i++) {
        tariffButton[i].style.display = 'none';
    }
    body.style.filter = 'blur(5px)';
    overlay.classList.add('active');
    offerModal.style.display = 'block';
      // Delete scroll window
      document.body.style.overflow = 'hidden';
      document.body.style.marginRight = '15px';
};

function closeOfferModal() {
    for (i = 0; i < tariffButton.length; i++) {
        tariffButton[i].style.display = 'block';
    }
    body.style.filter = 'blur(0px)';
    overlay.classList.remove('active');
    offerModal.style.display = 'none';
    document.body.style.overflow = '';
    document.body.style.marginRight = '0px';
};

//Close modal on click window

overlay.addEventListener('click', (event) =>{
    if(event.target === overlay){
        closeOfferModal ();
    }
});