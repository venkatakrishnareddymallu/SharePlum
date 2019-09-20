
var url = g1.url.parse(location.href)
$(document).ready(function () {
  $('#id').hide()
  var tab_function = {
    'new': cost_template, 'edit': edit_template, 'update': revenue_template,
    'estimate': estimate_template
  }

  $("#left_navbar").one('template', function () {
    $(".go_tab").on("click", function () {
      url = g1.url.parse(location.href)
      url.update({ 'tab': $(this).attr("data") })
      window.history.pushState({}, '', url.toString())
      location.href = '?tab=' + encodeURIComponent($(this).attr("data"));
    })
  }).template({ tab: tab_value })
  var tab_value = url.searchKey['tab'] || 'new'
  tab_function[tab_value]()
})
// $('.sidemenu').hide();
$('.navbutton').on('click', function () {
  $('.sidemenu').toggle("slow");
})


// $('#collapseExample').collapse()

// $.ajax({
//     url: '/test',
// }).done(addShow);
// function addShow(data) {
//     $('#example')
//         .one('template', function () {
//         })
//         .template({ data: data })
// }

function cost_template(edit_row_data) {
  show()
  $.get('label_new', function (json_data) {
    hide()
    $("#cost_template")
      .one('template', function () {
        $('#v-pills-home').addClass('active show')
        $('#dropdown_values').on('change', function () {
          auto_fill_new()
        })
        $('#rel_name').on('change', function () {
          auto_fill_new()
        })
        $('#feat').on('change', function () {
          feature_auto_fill()
        })
        $('#submit_form').on('click', function () {
          if($('#prime').val() == undefined){
          test_url = g1.url.parse(location.href)
          url = {
            'program': $('#dropdown_values').val(), 'status': $('#status').val(),
            'feature': $('#feat').val(), 'rel_name': $('#rel_name').val(), 'exp_rel_name': $('#ex_rel_name').val(),
            'cctag': $('#cctag').val(), 'crs': $('#crs').val()
          }
          test_url.update(url)
          $.get('submit_new?' + test_url.search, function (json_data) {
            alert("data uploaded")
          })
        } else {
          test_url = g1.url.parse(location.href)
          url = {
            'program': $('#dropdown_values').val(), 'status': $('#status').val(),
            'feature': $('#feat').val(), 'rel_name': $('#rel_name').val(), 'exp_rel_name': $('#ex_rel_name').val(),
            'cctag': $('#cctag').val(), 'crs': $('#crs').val(),'id': $('#prime').val()
          }
          test_url.update(url)
          $.get('submit_edit?' + test_url.search, function (json_data) {
            alert("data edited successfully")
          })
        }
        })
      })
      .template({ data: json_data, csrf: $('#csrf').val() })
    setTimeout(auto_fill_new, 1000)
    setTimeout(feature_auto_fill, 1000)
  })
}

function auto_fill_new() {
  pro = $('#dropdown_values').val()
  $('#rel_name option').remove()
  $.get('rel_name?program=' + pro, function (data) {
    _.forEach(_.uniq(data), function (d) {
      $("#rel_name").append('<option value="' + d + '">' + d + '</option>')
    })
  })
  setTimeout(ex_auto_fill_new, 8000)
}

function feature_auto_fill() {
  feat = $('#feat').val()
  $('#crs option').remove()
  $.get('cctag?cctag=' + feat, function (data) {
    _.forEach(_.uniq(data), function (d) {
      $("#crs").append('<option value="' + d + '">' + d + '</option>')
    })
  })
}

function ex_auto_fill_new() {
  pro = $('#dropdown_values').val()
  rel = $('#rel_name').val()
  $('#ex_rel_name option').remove()
  url = 'exp_rel_name?program=' + pro + '&' + 'rel=' + rel
  $.get(url, function (data) {
    hide()
    _.forEach(_.uniq(data), function (d) {
      $("#ex_rel_name").append('<option value="' + d + '">' + d + '</option>')
    })
  })
  if(g1.url.parse(location.href).searchKey.tab == 'edit'){
    setTimeout(update_edit_value(edit_row_data), 2000)
  }
}

function hide() {
  $('.background').hide()
  $('.loader').hide()
}

function show() {
  $('.background').show()
  $('.loader').show()
}



function edit_template() {
  show()
  $.get('edit_view', function (json_data) {
  $('#edit_template')
    .one('template', function (json_data) {
      var pro = []
      var rel = []
      _.forEach(json_data.templatedata.data, function(d){
        pro.push(d[0])
        rel.push(d[1])
      })
      _.forEach(_.uniq(pro), function (d) {
        $("#program").append('<option value="' + d + '">' + d + '</option>')
      })
      _.forEach(_.uniq(rel), function (d) {
        $("#rel_name").append('<option value="' + d + '">' + d + '</option>')
      })
      hide()
        pro = $('#program').val()
        rel = $('#rel_name').val()
        setTimeout(get_edit_data(pro,rel),2000)
    })
    .template({data: json_data})
  })
}

function get_edit_data(pro,rel) {
  $.get("edit_data?rel="+rel+"&pro="+pro).done(function(data){
    data = JSON.parse(data)
    $('#tabeltemp')
    .one('template', function (json_data) {
      $('#edit_form').on('click', function(){
        table = $('#example').DataTable()
        edit_row_data = table.rows('.selected').data()[0]
        $('#v-pills-profile').hide()
        $('#v-pills-home').addClass('active show')
        cost_template(edit_row_data)
        })
      data = json_data.templatedata.tabdata
      console.log(data)
        $('#example').DataTable( {
    columnDefs: [ {
        orderable: false,
        className: 'select-checkbox',
        targets:   0
    } ],
    select: {
        style:    'os',
        selector: 'td'
    },
    order: [[ 1, 'asc' ]]
} )
    })
    .template({tabdata: data})
    })
}

function update_edit_value(edit_row_data){
        $('#prime').val(edit_row_data[5])
        $('#dropdown_values').val(edit_row_data[6])
        $('#status').val(edit_row_data[8])
        $('#feat').val(edit_row_data[4])
        $('#rel_name').val(edit_row_data[7])
        $('#ex_rel_name').val(edit_row_data[3])
        $('#cctag').val(edit_row_data[1])
        $('#crs').val(edit_row_data[2])
}

function revenue_template(){
  $.get('label_new', function (json_data) {
    hide()
    $('#update_template').on('template', function(){
    }).template({data: json_data})
  })
}