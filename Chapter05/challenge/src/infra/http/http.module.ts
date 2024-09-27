import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { RegisterAdminController } from "./controllers/register-admin.controller";
import { RegisterAdminUseCase } from "@/domain/delivery/application/use-cases/register-admin";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { AuthenticateAdminController } from "./controllers/authenticate-admin.controller";
import { AuthenticateAdminUseCase } from "@/domain/delivery/application/use-cases/authenticate-admin";
import { RegisterRecipientUseCase } from "@/domain/delivery/application/use-cases/register-recipient";
import { RegisterRecipientController } from "./controllers/register-recipient.controller";
import { AuthenticateRecipientUseCase } from "@/domain/delivery/application/use-cases/authenticate-recipient";
import { AuthenticateRecipientController } from "./controllers/authenticate-recipient.controller";
import { RegisterDeliveryManController } from "./controllers/register-delivery-man.controller";
import { AuthenticateDeliveryManController } from "./controllers/authenticate-delivery-man.controller";
import { RegisterDeliveryManUseCase } from "@/domain/delivery/application/use-cases/register-delivery-man";
import { AuthenticateDeliveryManUseCase } from "@/domain/delivery/application/use-cases/authenticate-delivery-man";
import { ChangeAdminPasswordUseCase } from "@/domain/delivery/application/use-cases/change-admin-password";
import { ChangeAdminPasswordController } from "./controllers/change-admin-password.controller";
import { ChangeRecipientPasswordController } from "./controllers/change-recipient-password.controller";
import { ChangeDeliveryManPasswordController } from "./controllers/change-delivery-man-password.controller";
import { ChangeRecipientPasswordUseCase } from "@/domain/delivery/application/use-cases/change-recipient-password";
import { ChangeDeliveryManPasswordUseCase } from "@/domain/delivery/application/use-cases/change-delivery-man-password";
import { CreateOrderController } from "./controllers/create-order.controller";
import { CreateOrderUseCase } from "@/domain/delivery/application/use-cases/create-order";
import { DeleteOrderController } from "./controllers/delete-order.controller";
import { DeleteOrderUseCase } from "@/domain/delivery/application/use-cases/delete-order";
import { DeleteRecipientUseCase } from "@/domain/delivery/application/use-cases/delete-recipient";
import { DeleteRecipientController } from "./controllers/delete-recipient.controller";
import { DeleteDeliveryManUseCase } from "@/domain/delivery/application/use-cases/delete-delivery-man";
import { DeleteDeliveryManController } from "./controllers/delete-delivery-man.controller";
import { EditOrderController } from "./controllers/edit-order.controller";
import { EditOrderUseCase } from "@/domain/delivery/application/use-cases/edit-order";
import { EditRecipientUseCase } from "@/domain/delivery/application/use-cases/edit-recipient";
import { EditRecipientController } from "./controllers/edit-recipient.controller";
import { GetRecipientController } from "./controllers/get-recipient.controller";
import { GetRecipientUseCase } from "@/domain/delivery/application/use-cases/get-recipient";
import { GetDeliveryManUseCase } from "@/domain/delivery/application/use-cases/get-delivery-man";
import { GetDeliveryManController } from "./controllers/get-delivery-man.controller";
import { GetOrderUseCase } from "@/domain/delivery/application/use-cases/get-order";
import { GetOrderController } from "./controllers/get-order.controller";
import { MarkOrderAsInTransitController } from "./controllers/mark-order-as-in-transit.controller";
import { MarkOrderAsInTransitUseCase } from "@/domain/delivery/application/use-cases/mark-order-as-in-transit";
import { MarkOrderAsReturnedController } from "./controllers/mark-order-as-returned.controller";
import { MarkOrderAsReturnedUseCase } from "@/domain/delivery/application/use-cases/mark-order-as-returned";
import { MarkOrderAsDeliveredUseCase } from "@/domain/delivery/application/use-cases/mark-order-as-delivered";
import { MarkOrderAsDeliveredController } from "./controllers/mark-order-as-delivered.controller";
import { FetchDeliveryManOrdersController } from "./controllers/fetch-delivery-man-orders.controller";
import { FetchDeliveryManOrdersUseCase } from "@/domain/delivery/application/use-cases/fetch-delivery-man-orders";
import { FetchNearbyOrdersController } from "./controllers/fetch-nearby-orders.controller";
import { FetchNearbyOrdersUseCase } from "@/domain/delivery/application/use-cases/fetch-nearby-orders";

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule,
  ],
  controllers: [
    RegisterAdminController,
    AuthenticateAdminController,
    RegisterRecipientController,
    AuthenticateRecipientController,
    RegisterDeliveryManController,
    AuthenticateDeliveryManController,
    ChangeAdminPasswordController,
    ChangeRecipientPasswordController,
    ChangeDeliveryManPasswordController,
    CreateOrderController,
    DeleteOrderController,
    DeleteRecipientController,
    DeleteDeliveryManController,
    EditOrderController,
    EditRecipientController,
    GetRecipientController,
    GetDeliveryManController,
    GetOrderController,
    MarkOrderAsInTransitController,
    MarkOrderAsReturnedController,
    MarkOrderAsDeliveredController,
    FetchDeliveryManOrdersController,
    FetchNearbyOrdersController,
  ],
  providers: [
    RegisterAdminUseCase,
    AuthenticateAdminUseCase,
    RegisterRecipientUseCase,
    AuthenticateRecipientUseCase,
    RegisterDeliveryManUseCase,
    AuthenticateDeliveryManUseCase,
    ChangeAdminPasswordUseCase,
    ChangeRecipientPasswordUseCase,
    ChangeDeliveryManPasswordUseCase,
    CreateOrderUseCase,
    DeleteOrderUseCase,
    DeleteRecipientUseCase,
    DeleteDeliveryManUseCase,
    EditOrderUseCase,
    EditRecipientUseCase,
    GetRecipientUseCase,
    GetDeliveryManUseCase,
    GetOrderUseCase,
    MarkOrderAsInTransitUseCase,
    MarkOrderAsReturnedUseCase,
    MarkOrderAsDeliveredUseCase,
    FetchDeliveryManOrdersUseCase,
    FetchNearbyOrdersUseCase,
  ],
})
export class HttpModule {}