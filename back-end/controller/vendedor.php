<?php

require_once '../model/Connection.php';
extract($_POST);
$retorno = array();

if(isset($_POST['tipo'])){
    if($tipo == "listagem"){
        $con = new Connection();
        $sql = "SELECT * FROM vendedor ORDER BY nome ASC";
        $stmt = $con->connect()->prepare($sql);
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if($data){
            $retorno['status'] = 1;
            $retorno['vendedores'] = $data;
        } else {
            $retorno['status'] = 0;
            $retorno['msg'] = "Não há vendedores cadastrados";
        }
        
        
    } else {
        $retorno['status'] = 0;
        $retorno['msg'] = "Requisição inválida!";
    }
}

echo json_encode($retorno, JSON_UNESCAPED_UNICODE);

?>