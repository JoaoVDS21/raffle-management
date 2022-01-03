<?php

require_once '../model/Connection.php';
extract($_POST);
$retorno = array();

if(isset($_POST['tipo'])){
    if($tipo == "cadastrar"){
        $con = new Connection();

        if($vendedor != "default"){
            $sql = "SELECT id_venda, COUNT(*) 'qtd' FROM venda WHERE nome_escolhido_formatado = :nef AND num_rifa = :nr";
            $stmt = $con->connect()->prepare($sql);
            $stmt->bindParam(':nef', $formatedName);
            $stmt->bindParam(':nr', $numRifa);
            $stmt->execute();
            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            if($data['qtd'] == 0){
    
                $sql = 'INSERT INTO venda VALUES(0, :iv, :nc, :ne, :nef, :nr)';
                $stmt = $con->connect()->prepare($sql);
                $stmt->bindParam(':iv', $vendedor);
                $stmt->bindParam(':nc', $nomeComprador);
                $stmt->bindParam(':ne', $nomeEscolhido);
                $stmt->bindParam(':nef', $formatedName);
                $stmt->bindParam(':nr', $numRifa);
                if($stmt->execute()){
                    $retorno['status'] = 1;
                    $retorno['msg'] = "Sucesso ao cadastrar!";
                } else {
                    $retorno['status'] = 0;
                    $retorno['msg'] = "Falha ao cadastrar!";
                }
            } else {
                $retorno['status'] = 0;
                $retorno['msg'] = "Este nome já foi escolhido!";
            }
        } else {
            $retorno['status'] = 0;
            $retorno['msg'] = "Selecione um vendedor!";
        }
        
    } else if($tipo == "listagem"){
        $con = new Connection();
        if($vendedor == 'todos'){
            $sql = "SELECT venda.id_venda, vendedor.nome, venda.nome_cliente, venda.nome_escolhido FROM venda INNER JOIN vendedor ON venda.id_vendedor = vendedor.id_vendedor WHERE venda.num_rifa = :nr";
        } else {
            $sql = "SELECT venda.id_venda, vendedor.nome, venda.nome_cliente, venda.nome_escolhido FROM venda INNER JOIN vendedor ON venda.id_vendedor = vendedor.id_vendedor WHERE vendedor.id_vendedor = :iv AND venda.num_rifa = :nr";
        }
        $stmt = $con->connect()->prepare($sql);
        ($vendedor != 'todos') && $stmt->bindParam(':iv', $vendedor);
        $stmt->bindParam(':nr', $numRifa);
        $stmt->execute();
        $rifas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if($rifas){
            $retorno['status'] = 1;
            $retorno['rifas'] = $rifas;
        } else {
            $retorno['status'] = 0;
            $retorno['msg'] = "Não foram vendidas rifas";
        }
        
    } else if($tipo == "deletar"){
        $con = new Connection();
        $sql = 'DELETE FROM venda WHERE id_venda = :id';
        $stmt = $con->connect()->prepare($sql);
        $stmt->bindParam(':id', $id);
        if($stmt->execute()){
            $retorno['status'] = 1;
            $retorno['msg'] ='Nome deletado com sucesso!';
        } else {
            $retorno['status'] = 0;
            $retorno['msg'] = "Falha ao deletar nome";
        }
    } else if($tipo == "listagemTotal"){
        $con = new Connection();
        $sql = "SELECT venda.id_venda, venda.num_rifa FROM venda INNER JOIN vendedor ON venda.id_vendedor = vendedor.id_vendedor";
        $stmt = $con->connect()->prepare($sql);
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $retorno['status'] = 1;
        $retorno['rifas'] = $data;
    }
}

echo json_encode($retorno, JSON_UNESCAPED_UNICODE);

?>