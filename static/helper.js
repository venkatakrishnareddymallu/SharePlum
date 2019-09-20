/* exported get_edit_data*/

function get_edit_data(pro,rel) {
    $.get("edit_data?rel="+rel+"&pro="+pro, function(data){
      console.log(data)
  //     $('#tabeltemp')
  //     .one('template', function (json_data) {
  //       $('#edit_form').on('click', function(){
  //         table = $('#example').DataTable()
  //         edit_row_data = table.rows('.selected').data()[0]
  //         $('#v-pills-profile').hide()
  //         $('#v-pills-home').addClass('active show')
  //         cost_template(edit_row_data)
  //         })
  //       data = json_data.templatedata.tabdata
  //         $('#example').DataTable( {
  //     columnDefs: [ {
  //         orderable: false,
  //         className: 'select-checkbox',
  //         targets:   0
  //     } ],
  //     select: {
  //         style:    'os',
  //         selector: 'td'
  //     },
  //     order: [[ 1, 'asc' ]]
  // } )
  //     })
  //     .template({tabdata: data})
      })
  }