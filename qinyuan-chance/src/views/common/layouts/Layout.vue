<template>
<div id="sys-layout">
	<SysHeader></SysHeader>
	<Row>
		<Col :xs="0" :sm="0" :md="4" :lg="3">
		<SysSidebar></SysSidebar>
		</Col>
		<Col :xs="24" :sm="24" :md="20" :lg="21">
		<div id="content">
			<div class="Breadcrumb">
				<Breadcrumb>
					<BreadcrumbItem>{{breadParent}}</BreadcrumbItem>
					<BreadcrumbItem>{{breadChildren}}</BreadcrumbItem>
				</Breadcrumb>
			</div>
			<div class="layout-content">
				<router-view></router-view>
			</div>
		</div>
		</Col>
	</Row>
</div>
</template>
<script>
import SysHeader from '../partials/Header'
import SysSidebar from '../partials/Sidebar'
import {
	// mapActions,
	mapGetters
} from 'vuex'
export default {
	name: 'SysLayout',
	data() {
		return {
			parent: '',
			children: '',
		}
	},
	components: {
		SysHeader,
		SysSidebar,
	},
	computed: {
		...mapGetters({
			breadParent: 'breadParent',
			breadChildren: 'breadChildren',
		})
	},
}
</script>
<style lang="postcss" scoped>
#content {
  overflow: auto;
  height: calc(100vh - 60px);
  background-color: #fff;
  & .layout-content {
    padding: 16px;
  }
}
.Breadcrumb{
    margin: 20px 0px 20px 20px;
}
</style>
