//import page1 from '@/pages/page1'
const page1 = () => import('@/components/page1')

export default [
	{
		name: '',
		path: '/',
		component: page1
	},
	{
		name: 'tab1',
		path: '/tab1/:id',
		component: page1
	},
	{
		name: 'tab2',
		path: '/tab2/:id',
		component: page1	
	},
	{
		name: 'tab3',
		path: '/tab3/:id',
		component: page1
	},
	{
		name: 'tab4',
		path: '/tab4/:id',
		component: page1
	},
	{
		name: 'first',
		path: '/first/:id',
		component: page1,
		//redirect: '/tab2/:id'
		/*beforeEnter: (to, from, next) => {
			console.log(this)
			next( vm => {
		        console.log(vm)
		     })
		},
		beforeLeave: (to, from, next) => {
			console.log(456)
		}*/
	},
	{
		name: 'second',
		path: '/second/:id',
		component: page1
	}
]