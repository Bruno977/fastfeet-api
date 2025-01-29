### Regras da aplicação

- A aplicação deve ter dois tipos de usuário, entregador e/ou admin
- Deve ser possível realizar login com CPF e Senha
- [x] Deve ser possível realizar o CRUD dos entregadores
- [x] Deve ser possível realizar o CRUD das encomendas
- Deve ser possível realizar o CRUD dos destinatários
- [x] Deve ser possível marcar uma encomenda como aguardando (Disponível para retirada)
- [x] Deve ser possível retirar uma encomenda
- [x] Deve ser possível marcar uma encomenda como entregue
- [x] Deve ser possível marcar uma encomenda como devolvida
- Deve ser possível listar as encomendas com endereços de entrega próximo ao local do entregador
  - [x] Deve ser possível alterar a senha de um usuário
- Deve ser possível listar as entregas de um usuário
- Deve ser possível notificar o destinatário a cada alteração no status da encomenda

### Regras de negócio

- [x] Somente usuário do tipo admin pode realizar operações de CRUD nas encomendas
- [x] Somente usuário do tipo admin pode realizar operações de CRUD dos entregadores
- Somente usuário do tipo admin pode realizar operações de CRUD dos destinatários
- Para marcar uma encomenda como entregue é obrigatório o envio de uma foto
- [x] Somente o entregador que retirou a encomenda pode marcar ela como entregue
- Somente o admin pode alterar a senha de um usuário
- Não deve ser possível um entregador listar as encomendas de outro entregador

Domain:
- deliveries
    - Entities:
      - [x] DeliveryMan (entregador)
      - [x] Order (encomenda)
      - Recipient (destinatário)
      - Address (endereço)
        - Use Cases:
          - AuthenticateDeliveryMan (Autenticar entregador)
          - [x] CreateDeliveryMan (Criar entregador)
          - [x] UpdateDeliveryMan (Atualizar entregador)
          - [x] DeleteDeliveryMan (Remover entregador)
          - [x] FindDeliveryMan (Buscar entregador)
          - [x] CreateOrder (Criar encomenda)
          - [x] UpdateOrder (Atualizar encomenda)
          - [x] DeleteOrder (Remover encomenda)
          - [x] FindOrder (Buscar encomenda)
          - CreateRecipient (Criar destinatário)
          - UpdateRecipient (Atualizar destinatário)
          - DeleteRecipient (Remover destinatário)
          - FindRecipient (Buscar destinatário)
          - PickUpOrder (Retirar uma encomenda)
          - UpdateOrderStatus (Alterar status da encomenda)
          - ListOrders (Listar as encomendas)
          - ListDeliveries (Listar as entregas)
- notification
    - Entities:
      - Notification (notificação)
    - Use Cases:
      - NotifyRecipient (Notificar o destinatário)
