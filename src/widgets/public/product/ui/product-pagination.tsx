"use client";

import { Pagination } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

export type ProductPaginationProps = {
    page: number;
    totalPage: number;
};

export const ProductPagination = ({ page, totalPage }: ProductPaginationProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const handleChangePage = (event: React.ChangeEvent<unknown>, page: number) => {
        console.log("New page", page);
        const searchParamsURL = new URLSearchParams(searchParams);

        searchParamsURL.set("page", page.toString());

        router.push(`${pathname}?${searchParamsURL.toString()}`, { scroll: false });
    };

    return <Pagination page={page} count={totalPage} onChange={handleChangePage} color="primary" sx={{ mt: 3 }} />;
};
