import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/common/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: () => import('@/components/login.vue'),
    },
    {
      path: '/index',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '',
          component: () => import('@/components/index.vue')
        },
        {
          path: 'student',
          component: () => import('@/components/student.vue')
        },
        {
          path: 'teacher',
          component: () => import('@/components/teacher.vue')
        },
        {
          path: 'grade',
          component: () => import('@/components/grades.vue')
        },
        {
          path: 'practice',
          component: () => import('@/components/practice.vue')
        },
        {
          path: 'profession',
          component: () => import('@/components/profession.vue')
        },
        {
          path: 'professionalGrade',
          component: () => import('@/components/professionalGrade.vue')
        },
        {
          path: 'teacherProfessionalGrade',
          component: () => import('@/components/teacherProfessionalGrade.vue')
        },
        {
          path: 'major',
          component: () => import('@/components/major.vue')
        }
      ]
    }
  ],
})
