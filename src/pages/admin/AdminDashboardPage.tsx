import React from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  Users,
  ArrowRight,
  Plus,
  Sliders,
  Database,
  ExternalLink,
} from 'lucide-react';
import { productService, orderService } from '../../services';

export const AdminDashboardPage: React.FC = () => {
  const products = productService.getAll();
  const orders = orderService.getAll();

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.orderStatus === 'PLACED' || o.orderStatus === 'CONFIRMED').length;
  const processingOrders = orders.filter((o) => o.orderStatus === 'PROCESSING').length;
  const dispatchedOrders = orders.filter((o) => o.orderStatus === 'DISPATCHED' || o.orderStatus === 'OUT_FOR_DELIVERY').length;
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'DELIVERED').length;

  const totalSales = orders.reduce((sum, o) => sum + (o.orderStatus !== 'CANCELLED' ? o.total : 0), 0);

  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold);
  const outOfStockProducts = products.filter((p) => p.stock <= 0);

  // Unique customers based on mobile numbers
  const uniqueCustomerPhones = new Set(orders.map((o) => o.customer.mobile.trim()));
  const totalCustomers = uniqueCustomerPhones.size;

  const statCards = [
    { title: 'Total Products', value: totalProducts, icon: Package, color: 'text-emerald-700', bg: 'bg-emerald-50', link: '/admin/products' },
    { title: 'Total Orders', value: totalOrders, icon: ShoppingBag, color: 'text-blue-700', bg: 'bg-blue-50', link: '/admin/orders' },
    { title: 'Pending Orders', value: pendingOrders, icon: Clock, color: 'text-amber-700', bg: 'bg-amber-50', link: '/admin/orders?status=PLACED' },
    { title: 'Processing Orders', value: processingOrders, icon: Clock, color: 'text-indigo-700', bg: 'bg-indigo-50', link: '/admin/orders?status=PROCESSING' },
    { title: 'Dispatched Orders', value: dispatchedOrders, icon: Truck, color: 'text-purple-700', bg: 'bg-purple-50', link: '/admin/orders?status=DISPATCHED' },
    { title: 'Delivered Orders', value: deliveredOrders, icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-50', link: '/admin/orders?status=DELIVERED' },
    { title: 'Total Sales (PKR)', value: `Rs. ${totalSales.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-800', bg: 'bg-emerald-100/60', link: '/admin/orders' },
    { title: 'Low Stock Alert', value: lowStockProducts.length, icon: AlertTriangle, color: 'text-amber-700', bg: 'bg-amber-50', link: '/admin/inventory' },
    { title: 'Out of Stock', value: outOfStockProducts.length, icon: AlertTriangle, color: 'text-rose-700', bg: 'bg-rose-50', link: '/admin/inventory' },
    { title: 'Customers', value: totalCustomers, icon: Users, color: 'text-stone-700', bg: 'bg-stone-100', link: '/admin/customers' },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-stone-900">Admin Dashboard</h1>
          <p className="text-xs text-stone-500 mt-1">
            Store operations overview for Agro Baadshah, Khanpur Mandi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/products"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0e4d34] hover:bg-[#093926] text-white text-xs font-bold rounded-lg shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </Link>
          <Link
            to="/admin/homepage-slider"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold rounded-lg shadow-xs transition"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Manage Slider</span>
          </Link>
        </div>
      </div>

      {/* 10 Required Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="bg-white border border-stone-200/90 rounded-xl p-4 hover:border-emerald-600 transition shadow-xs flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider line-clamp-1">
                  {card.title}
                </span>
                <div className={`p-1.5 rounded-lg ${card.bg} ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-lg sm:text-xl font-extrabold text-stone-900 group-hover:text-emerald-800 transition">
                {card.value}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Two Column Section: Recent Orders & Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">Recent Customer Orders</h3>
              <p className="text-xs text-stone-500">Live order queue from store</p>
            </div>
            <Link to="/admin/orders" className="text-xs font-bold text-emerald-800 hover:underline">
              View All Orders →
            </Link>
          </div>

          <div className="divide-y divide-stone-100">
            {recentOrders.length === 0 ? (
              <p className="text-xs text-stone-500 italic py-4">No orders placed yet.</p>
            ) : (
              recentOrders.map((ord) => (
                <div key={ord.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 font-mono">{ord.id}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-100 text-stone-800">
                        {ord.orderStatus}
                      </span>
                    </div>
                    <p className="text-stone-500 mt-0.5">
                      {ord.customer.fullName} ({ord.customer.city}) · {ord.items.length} items
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-stone-900 block">Rs. {ord.total.toLocaleString()}</span>
                    <Link
                      to={`/admin/orders?view=${ord.id}`}
                      className="text-[11px] text-emerald-800 font-semibold hover:underline"
                    >
                      Manage Order
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Alerts (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">Inventory Alerts</h3>
              <p className="text-xs text-stone-500">Low stock or out of stock products</p>
            </div>
            <Link to="/admin/inventory" className="text-xs font-bold text-emerald-800 hover:underline">
              Manage Stock →
            </Link>
          </div>

          <div className="divide-y divide-stone-100">
            {lowStockProducts.concat(outOfStockProducts).slice(0, 5).length === 0 ? (
              <p className="text-xs text-emerald-700 italic py-4">All products are healthy in stock.</p>
            ) : (
              lowStockProducts.concat(outOfStockProducts).slice(0, 5).map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded border" />
                    <div>
                      <p className="font-bold text-stone-900 line-clamp-1">{p.name}</p>
                      <p className="text-stone-500 text-[11px]">{p.packSize}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-bold ${
                        p.stock <= 0 ? 'text-rose-600' : 'text-amber-600'
                      }`}
                    >
                      {p.stock <= 0 ? 'Out of Stock' : `${p.stock} left`}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
