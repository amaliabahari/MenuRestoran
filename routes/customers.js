var express = require('express');
var router = express.Router();
var authentication_mdl = require('../middlewares/authentication');
var session_store;
/* GET Customer page. */

router.get('/',authentication_mdl.is_login, function(req, res, next) {
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM customer',function(err,rows)
		{
			if(err)
				var errornya  = ("Error Selecting : %s ",err );   
			req.flash('msg_error', errornya);   
			res.render('customer/list',{title:"Customers",data:rows,session_store:req.session});
		});
         //console.log(query.sql);
     });
});

router.delete('/delete/(:id)',authentication_mdl.is_login, function(req, res, next) {
	req.getConnection(function(err,connection){
		var customer = {
			id: req.params.id,
		}
		
		var delete_sql = 'delete from customer where ?';
		req.getConnection(function(err,connection){
			var query = connection.query(delete_sql, customer, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Delete : %s ",err);
					req.flash('msg_error', errors_detail); 
					res.redirect('/customers');
				}
				else{
					req.flash('msg_info', 'Delete Customer Success'); 
					res.redirect('/customers');
				}
			});
		});
	});
});
router.get('/edit/(:id)',authentication_mdl.is_login, function(req,res,next){
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM customer where id='+req.params.id,function(err,rows)
		{
			if(err)
			{
				var errornya  = ("Error Selecting : %s ",err );  
				req.flash('msg_error', errors_detail); 
				res.redirect('/customers'); 
			}else
			{
				if(rows.length <=0)
				{
					req.flash('msg_error', "Customer can't be find!"); 
					res.redirect('/customers');
				}
				else
				{	
					console.log(rows);
					res.render('customer/edit',{title:"Edit ",data:rows[0],session_store:req.session});

				}
			}

		});
	});
});
router.put('/edit/(:id)',authentication_mdl.is_login, function(req,res,next){
	req.assert('nama_customer', 'Please fill the nama_customer').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {
		v_nama_customer = req.sanitize( 'nama_customer' ).escape().trim(); 
		v_nama_menu = req.sanitize( 'nama_menu' ).escape().trim();
		v_kategori_menu = req.sanitize( 'kategori_menu' ).escape().trim();
		v_harga = req.sanitize( 'harga' ).escape();

		var customer = {
			nama_customer: v_nama_customer,
			nama_menu: v_nama_menu,
			kategori_menu: v_kategori_menu,
			harga : v_harga
		}

		var update_sql = 'update customer SET ? where id = '+req.params.id;
		req.getConnection(function(err,connection){
			var query = connection.query(update_sql, customer, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Update : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('customer/edit', 
					{ 
						nama_customer: req.param('nama_customer'), 
						nama_customer: req.param('nama_menu'),
						kategori_menu: req.param('kategori_menu'),
						harga: req.param('harga'),
					});
				}else{
					req.flash('msg_info', 'Update customer success'); 
					res.redirect('/customers');
				}		
			});
		});
	}else{

		console.log(errors);
		errors_detail = "<p>Sory there are error</p><ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.redirect('/customers');
	}
});

router.post('/add',authentication_mdl.is_login, function(req, res, next) {
	req.assert('nama_customer', 'Please fill the nama_customer').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {

		v_nama_customer = req.sanitize( 'nama_customer' ).escape().trim(); 
		v_nama_menu = req.sanitize( 'nama_menu' ).escape().trim();
		v_kategori_menu = req.sanitize( 'kategori_menu' ).escape().trim();
		v_harga = req.sanitize( 'harga' ).escape();

		var customer = {
			nama_customer: v_nama_customer,
			nama_menu: v_nama_menu,
			kategori_menu: v_kategori_menu,
			harga : v_harga
		}

		var insert_sql = 'INSERT INTO customer SET ?';
		req.getConnection(function(err,connection){
			var query = connection.query(insert_sql, customer, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Insert : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('customer/add-customer', 
					{ 
						nama_customer: req.param('nama_customer'), 
						nama_menu: req.param('nama_menu'),
						kategori_menu: req.param('kategori_menu'),
						harga: req.param('harga'),
						session_store:req.session,
					});
				}else{
					req.flash('msg_info', 'Create customer success'); 
					res.redirect('/customers');
				}		
			});
		});
	}else{

		console.log(errors);
		errors_detail = "<p>Sory there are error</p><ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('customer/add-customer', 
		{ 
			nama_customer: req.param('nama_customer'), 
			nama_menu: req.param('nama_menu'),
			session_store:req.session
		});
	}

});

router.get('/add',authentication_mdl.is_login, function(req, res, next) {
	res.render(	'customer/add-customer', 
	{ 
		title: 'Add New Menu Restoran',
		nama_customer: '',
		nama_menu: '',
		kategori_menu:'',
		harga:'',
		session_store:req.session
	});
});

module.exports = router;
