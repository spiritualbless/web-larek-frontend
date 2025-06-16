import { Api } from '../base/api';
import { IProduct, ApiListResponse, ISuccess, IOrder } from '../../types';
import { CDN_URL } from '../../utils/constants';

export class WebLarekApi extends Api {
	private cdn: string;

	constructor(baseUrl: string, cdnUrl: string = CDN_URL) {
		super(baseUrl);
		this.cdn = cdnUrl;
	}

getProducts(): Promise<IProduct[]> {
    return this.get('/product').then((data: ApiListResponse<IProduct>) =>
        data.items.map((product) => ({
            ...product,
            image: this.cdn + product.image.replace('.svg', '.png')
        }))
    );
}

order(data: IOrder): Promise<ISuccess> {
	return this.post('/order', data) as Promise<ISuccess>;
}
}

