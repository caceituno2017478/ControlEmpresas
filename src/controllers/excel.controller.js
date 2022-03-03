const xl = require('excel4node');
const Empleado = require('../models/empleado.model');

function creacionExcel(req,res){

    Empleado.find({empresa: req.user.empresa},(err, empleadosEncontrados) => {
        if (err) return res.status(500).send({ mensaje: "Error en la peticion"})

        // instancia
        var wb = new xl.Workbook();
        var ws = wb.addWorksheet(req.user.empresa);
        // crear estilos
        var style = wb.createStyle({
        font: {
            color: 'black',
            size: 12,
        } 
        });
        
        // con letra azul
        var styleBlue = wb.createStyle({
            font: {
                color: 'blue',
                size: 15,
            } 
        });
        
            

        if(empleadosEncontrados.length === 0 ){
            ws.cell(1, 1).string("Nombre").style(styleBlue);
                
            ws.cell(1, 2).string("Apellido").style(styleBlue);
            
            ws.cell(1, 3).string("Departamento").style(styleBlue);
            
            ws.cell(1, 4).string("Puesto").style(styleBlue);
            
            ws.cell(2, 1).string("N/A").style(style);

            ws.cell(2, 2).string("N/A").style(style);

            ws.cell(2, 3).string("N/A").style(style);

            ws.cell(2, 4).string("N/A").style(style);

            ws.column(3).setWidth(18);
            ws.column(4).setWidth(18);
        }else{

            for( var i=0,e=1; i < empleadosEncontrados.length; i++){
                e++
                //Fila Columna 
                ws.cell(1, 1).string("Nombre").style(styleBlue);
                
                ws.cell(1, 2).string("Apellido").style(styleBlue);
                
                ws.cell(1, 3).string("Departamento").style(styleBlue);
                
                ws.cell(1, 4).string("Puesto").style(styleBlue);
                
                ws.cell(e, 1).string(empleadosEncontrados[i].nombre).style(style);
    
                ws.cell(e, 2).string(empleadosEncontrados[i].apellido).style(style);
    
                ws.cell(e, 3).string(empleadosEncontrados[i].departamento).style(style);
    
                ws.cell(e, 4).string(empleadosEncontrados[i].puesto).style(style);
                // para agregar un ancho a la columna
                // opcional
                ws.column(3).setWidth(18);
                ws.column(4).setWidth(18);
            }

        }
        // ciclo for
        const pathExcel = "./src/excel/"
        wb.write(pathExcel+req.user.empresa+'.xlsx');
    
    })
    return res.status(200).send({mesaje: "Excel generado"})
}
 
module.exports = {
    creacionExcel
}